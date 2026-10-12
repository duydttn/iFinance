const TelegramBot = require('node-telegram-bot-api');

module.exports = (dependencies) => {
    const {
        TransactionModel,
        ClassifierService,
        AuditLogModel,
        UserModel,
        AIService,
        db,
        config,
        io
    } = dependencies;

    const token = config.TELEGRAM_BOT_TOKEN;

    if (!token || token === 'your_bot_token_here') {
        console.warn('⚠️ Telegram Bot Token is missing in .env. Telegram integration disabled.');
        return null;
    }

    const bot = new TelegramBot(token, { polling: true });
    const rateLimitMap = new Map();

    function checkRateLimit(chatId) {
        const now = Date.now();
        const recent = (rateLimitMap.get(chatId) || []).filter(t => now - t < 60000);
        if (recent.length >= 10) return false;
        rateLimitMap.set(chatId, [...recent, now]);
        return true;
    }

    bot.onText(/\/start|\/help/, (msg) => {
        const chatId = msg.chat.id;
        const resp = `👋 Xin chào! Tôi là Bot quản lý thu chi iFinance.\n\n` +
            `Vui lòng nhập giao dịch theo định dạng tự nhiên.\n` +
            `Ví dụ: "Chi 500k an trua" hoặc "Thu 10tr luong tháng 3".\n\n` +
            `Hệ thống sẽ tự động quét số tiền và dùng AI để phân loại danh mục, sau đó đưa vào trạng thái "Chờ xác nhận" trên hệ thống.`;
        bot.sendMessage(chatId, resp);
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        const user = UserModel.findByChatId(chatId.toString());
        if (!user) {
            if (text && !text.startsWith('/')) {
                bot.sendMessage(chatId, '⚠️ Tài khoản Telegram của bạn chưa được liên kết với iFinance.\n' +
                    'Vui lòng vào phần **Cài đặt -> Hệ thống** trên ứng dụng để nhập Chat ID của bạn.\n' +
                    `Chat ID của bạn là: \`${chatId}\``, { parse_mode: 'Markdown' });
            }
            return;
        }

        if (!checkRateLimit(chatId)) {
            bot.sendMessage(chatId, '⚠️ Bạn gửi quá nhiều tin nhắn. Vui lòng đợi 1 phút.');
            return;
        }

        if (!text || text.startsWith('/')) return;

        let type = 'expense';
        let amount = 0;
        let description = text;
        let suggestedCategoryId = null;

        try {
            const categories = db.prepare('SELECT id, name FROM categories').all();
            const aiResult = await AIService.parseTelegramMessage(text, categories);

            if (aiResult && typeof aiResult.amount === 'number') {
                amount = aiResult.amount;
                type = aiResult.type === 'income' ? 'income' : 'expense';
                description = aiResult.description || text;
                if (aiResult.suggested_category_id) {
                    suggestedCategoryId = aiResult.suggested_category_id;
                }
                // console.log('🤖 AI parsed successfully:', aiResult);
            }
        } catch (e) {
            console.error('AI parsing failed, falling back to regex...', e);
        }

        // Fallback logic if AI failed
        if (amount === 0) {
            const lowerText = text.toLowerCase();
            if (lowerText.startsWith('thu ')) type = 'income';
            else if (lowerText.startsWith('chi ')) type = 'expense';

            const suffixMap = { 'triệu': 1_000_000, 'tr': 1_000_000, 'm': 1_000_000, 'k': 1_000 };
            const amountRegex = /(?:thu|chi)?\s*([\d,\.]+)\s*(triệu|tr|m|k)?\s*(.*)/i;
            const match = lowerText.match(amountRegex);

            if (match) {
                let rawNum = parseFloat(match[1].replace(/,/g, '').replace(/\./g, ''));
                const suffix = (match[2] || '').toLowerCase();
                rawNum *= suffixMap[suffix] || 1;
                amount = rawNum;
                description = match[3] ? match[3].trim() : text;
            }
        }

        if (amount === 0) {
            bot.sendMessage(chatId, '❌ Không thể nhận diện số tiền. Vui lòng thử lại theo định dạng: "Chi 50k ăn trưa".');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const data = {
            date: today,
            description: description,
            amount: amount,
            type: type,
            scope: /công ty|kinh doanh|business/i.test(text) ? 'business' : 'personal',
            status: 'pending',
            source: 'telegram',
            created_by: user.id
        };

        if (suggestedCategoryId) {
            data.suggested_category_id = suggestedCategoryId;
            data.confidence_score = 0.95;
        } else {
            const classification = ClassifierService.classifyTransaction(description, data.scope);
            if (ClassifierService.shouldSuggest(classification.confidence)) {
                data.suggested_category_id = classification.category_id;
                data.confidence_score = classification.confidence;
            }
        }

        try {
            const id = TransactionModel.create(data);

            AuditLogModel.log(
                user.id,
                'CREATE_TRANSACTION',
                'transaction',
                id,
                { amount: data.amount, type: data.type, source: 'telegram' },
                'telegram-bot'
            );

            if (io) {
                io.emit('transaction_updated', { source: 'telegram', id });
            }

            bot.sendMessage(chatId, `✅ Đã ghi nhận: ${type === 'income' ? 'Thu' : 'Chi'} ${amount.toLocaleString('vi-VN')}đ cho "${description}".\n(Trạng thái: Chờ xác nhận)`);
        } catch (e) {
            console.error('Telegram bot error creating transaction:', e);
            bot.sendMessage(chatId, '❌ Lỗi hệ thống khi lưu giao dịch.');
        }
    });

    try {
        bot.getMe().then(me => {
            bot.botInfo = {
                id: me.id,
                first_name: me.first_name,
                username: me.username
            };
            console.log(`🤖 Telegram Bot [${me.first_name}] (@${me.username}) initialized.`);
        });
    } catch (e) {
        console.error('❌ Failed to fetch Telegram bot info:', e.message);
    }

    return bot;
};
