const axios = require('axios');

module.exports = (config) => ({
    apiUrl: config.AI_API_URL || 'http://127.0.0.1:1234/v1',
    model: 'local-model',

    async callLLM(systemPromptOrMessages, userPrompt = null, jsonMode = false) {
        let messages = [];
        if (Array.isArray(systemPromptOrMessages)) {
            messages = systemPromptOrMessages;
        } else {
            messages = [
                { role: 'system', content: systemPromptOrMessages },
                { role: 'user', content: userPrompt }
            ];
        }

        try {
            const response = await fetch(`${this.apiUrl}/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    temperature: 0.2,
                    response_format: jsonMode ? { type: "json_object" } : undefined
                }),
                signal: AbortSignal.timeout(45000)
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status} - ${responseText.slice(0, 100)}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`AI API returned invalid JSON: ${responseText.slice(0, 100)}`);
            }

            const content = data.choices?.[0]?.message?.content;
            if (!content) return null;

            return jsonMode ? JSON.parse(content) : content;
        } catch (error) {
            console.error('AI Service Error:', error.message);
            return null;
        }
    },

    async parseTelegramMessage(text, availableCategories) {
        const catStr = availableCategories.map(c => `[ID:${c.id}] ${c.name}`).join(', ');
        const systemPrompt = `Bạn là một trợ lý ảo kế toán thông minh tiếng Việt. 
Nhiệm vụ của bạn là trích xuất thông tin giao dịch từ tin nhắn văn bản của người dùng và trả về MỘT chuỗi JSON hợp lệ.
KHÔNG giải thích, KHÔNG thêm markdown, CHỈ trả về JSON.

Cấu trúc JSON mong muốn:
{
  "amount": <number, số tiền VND (ví dụ 50k = 50000, 2tr = 2000000)>,
  "type": <string, "income" nếu là thu, "expense" nếu là chi>,
  "description": <string, mô tả ngắn gọn (loại bỏ số tiền)>,
  "suggested_category_id": <number hoặc null, chọn ID danh mục phù hợp nhất từ danh sách bên dưới>
}

Danh sách danh mục đang có:
${catStr}`;

        const userPrompt = `Tin nhắn: "${text}"`;

        try {
            const result = await this.callLLM(systemPrompt, userPrompt, true);
            if (!result || typeof result.amount !== 'number' || typeof result.type !== 'string') {
                return null;
            }
            return result;
        } catch (e) {
            console.error('Error parsing Telegram text via AI:', e);
            return null;
        }
    },

    async explainAnomaly(transaction, categoryAvg) {
        const isIncome = transaction.type === 'income';
        const contextStr = isIncome ? 'TĂNG TRƯỞNG THU NHẬP ĐỘT BIẾN (thu nhiều hơn bình thường)' : 'CÓ DẤU HIỆU BẤT THƯỜNG (chi quá lớn so với trung bình)';
        
        const systemPrompt = `Bạn là chuyên gia phân tích tài chính cá nhân và doanh nghiệp.
        Bạn nhận được thông tin về một giao dịch ${contextStr}.
        Nhiệm vụ: Viết 1-2 câu ngắn gọn bằng tiếng Việt để lý giải sự chênh lệch này cho người dùng hiểu. Với thu nhập, hãy dùng giọng điệu tích cực khen ngợi. Với chi tiêu, hãy dùng giọng điệu cảnh báo nhẹ nhàng. Không dùng từ ngữ quá kỹ thuật.`;

        const userPrompt = `Giao dịch ${isIncome ? 'thu nhập đột biến' : 'chi tiêu bất thường'}:
        - Diễn giải: ${transaction.description}
        - Số tiền ${isIncome ? 'thu' : 'chi'}: ${transaction.amount.toLocaleString('vi-VN')} đ
        - Trung bình hạng mục này mọi khi: ${categoryAvg.toLocaleString('vi-VN')} đ

        Hãy viết một câu ${isIncome ? 'nhận xét tích cực' : 'cảnh báo'} và phân tích độ chênh lệch.`;

        const explanation = await this.callLLM(systemPrompt, userPrompt, false);
        const prefix = isIncome ? 'Tích cực:' : 'Cảnh báo:';
        const formattedAvg = Math.round(categoryAvg).toLocaleString('vi-VN');
        return explanation ? `${prefix} ${explanation}` : `${prefix} Giao dịch lệch chuẩn so với mức trung bình ${formattedAvg}đ.`;
    },

    async suggestCategory(description, existingCategories) {
        const catList = existingCategories.map(c => `[ID:${c.id}] ${c.name}`).join(', ');
        const systemPrompt = `Bạn là chuyên gia kế toán. Phân loại giao dịch sau vào danh mục phù hợp.
        Nếu thấy danh mục nào hiện có phù hợp (>70% chắc chắn), hãy trả về ID của nó.
        Nếu KHÔNG có danh mục nào phù hợp, hãy trả về category_id: null và đề xuất 1 tên danh mục mới ngắn gọn trong "newCategoryName".

        Trả về JSON duy nhất: {"category_id": number|null, "confidence": number, "newCategoryName": string|null}

        Danh sách danh mục: ${catList}`;

        const userPrompt = `Mô tả giao dịch: "${description}"`;
        return this.callLLM(systemPrompt, userPrompt, true);
    },

    async generateFinancialInsight(stats, categoryStats, startDate, endDate) {
        const fmt = (n) => (n || 0).toLocaleString('vi-VN') + 'đ';
        const incomeStr = categoryStats.filter(c => c.type === 'income')
            .map(c => `- ${c.name}: +${fmt(c.total)}`).join('\n') || '(không có)';
        const expenseStr = categoryStats.filter(c => c.type === 'expense')
            .map(c => `- ${c.name}: -${fmt(c.total)}`).join('\n') || '(không có)';

        const systemPrompt = `Bạn là giám đốc tài chính (CFO) chuyên nghiệp. 
        Nhiệm vụ của bạn là đưa ra một NHẬN XÉT THÔNG MINH, NGẮN GỌN (tối đa 3 câu) về tình hình tài chính trong khoảng thời gian được cung cấp.
        Tập trung vào: Sự cân bằng thu chi, các hạng mục chi tiêu lớn nhất, và một lời khuyên hành động.
        Ngôn ngữ: Tiếng Việt, chuyên nghiệp nhưng dễ hiểu.`;

        const userPrompt = `Báo cáo từ ${startDate} đến ${endDate}:
        - Tổng Thu: ${fmt(stats.total_income)}
        - Tổng Chi: ${fmt(stats.total_expense)}
        - Thống kê theo danh mục Thu:
        ${incomeStr}
        - Thống kê theo danh mục Chi:
        ${expenseStr}

        Hãy viết một nhận xét ngắn gọn 2-3 câu.`;

        const insight = await this.callLLM(systemPrompt, userPrompt, false);
        return insight || `Trong kỳ từ ${startDate} đến ${endDate}, tổng thu là ${fmt(stats.total_income)} và tổng chi là ${fmt(stats.total_expense)}.`;
    }
});