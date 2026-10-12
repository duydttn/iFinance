const express = require('express');
const auth = require('../middleware/auth');

module.exports = (container) => {
    const router = express.Router();
    const aiManager = container.resolve('aiManager');
    const aiService = container.resolve('aiService');
    const TransactionModel = container.resolve('TransactionModel');
    const CategoryModel = container.resolve('CategoryModel');
    const SettingModel = container.resolve('SettingModel');
    const telegramService = container.resolve('telegramService');
    const io = container.resolve('io');

    // ─── Status & Engine Control ──────────────────────────────────────────────

    router.get('/status', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const status = aiManager.getStatus();
            res.json(status);
        } catch (error) {
            console.error('Get status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/specs', auth.authenticate, auth.authorize('Admin'), async (req, res) => {
        try {
            const specs = await aiManager.getSystemSpecs();
            res.json(specs);
        } catch (error) {
            console.error('Get specs error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/setup-engine', auth.authenticate, auth.authorize('Admin'), async (req, res) => {
        try {
            aiManager.setSocket(io);
            await aiManager.setupEngine();
            res.json({ message: 'Engine setup started' });
        } catch (error) {
            console.error('Setup engine error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/setup-model', auth.authenticate, auth.authorize('Admin'), async (req, res) => {
        try {
            aiManager.setSocket(io);
            await aiManager.setupModel();
            res.json({ message: 'Model setup started' });
        } catch (error) {
            console.error('Setup model error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/start', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            aiManager.setSocket(io);
            aiManager.startServer();
            res.json({ message: 'AI Engine start command sent' });
        } catch (error) {
            console.error('Start engine error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/stop', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            aiManager.stopServer();
            res.json({ message: 'AI Engine stop command sent' });
        } catch (error) {
            console.error('Stop engine error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // ─── AI Insights & Analysis ────────────────────────────────────────────────

    router.post('/analyze-period', auth.authenticate, async (req, res) => {
        try {
            const { start_date, end_date, scope } = req.body;
            const stats = TransactionModel.getStats({ start_date, end_date, scope });
            const categoryStats = TransactionModel.getCategoryStats({ start_date, end_date, scope });

            const insight = await aiService.generateFinancialInsight(stats, categoryStats, start_date, end_date);
            res.json({ insight });
        } catch (error) {
            console.error('Analyze period error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/analyze-all', auth.authenticate, async (req, res) => {
        try {
            const stats = TransactionModel.getStats({});
            const categoryStats = TransactionModel.getCategoryStats({});

            // Lấy danh sách bất thường (trong 6 tháng gần nhất để đảm bảo hiệu suất)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const startDateStr = sixMonthsAgo.toISOString().split('T')[0];

            const anomalyDetector = container.resolve('anomalyDetector');
            const anomalies = anomalyDetector.getAnomalousTransactions(startDateStr);

            let anomalyCount = 0;
            // Chỉ giải thích tối đa 10 giao dịch bất thường mới nhất chưa có giải thích để tránh timeout
            const targets = anomalies
                .filter(a => !a.ai_explanation)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);

            for (const anomaly of targets) {
                const avg = anomaly.anomaly_details?.average || 0;
                const explanation = await aiService.explainAnomaly(anomaly, avg);
                TransactionModel.update(anomaly.id, { ai_explanation: explanation });
                anomalyCount++;
            }

            const insight = await aiService.generateFinancialInsight(stats, categoryStats, 'từ trước đến nay', 'hiện tại');

            res.json({
                insight,
                count: stats.total_income > 0 || stats.total_expense > 0 ? (stats.count_income + stats.count_expense) : 0,
                anomalies_found: anomalies.length,
                anomalies_explained: anomalyCount
            });
        } catch (error) {
            console.error('Analyze all error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/auto-classify', auth.authenticate, async (req, res) => {
        try {
            const pendingTransactions = TransactionModel.getAll({ status: 'pending' });
            const unclassified = TransactionModel.getAll({ category_id: null });

            const targets = [...pendingTransactions, ...unclassified].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

            if (targets.length === 0) return res.json({ message: 'No transactions to classify', count: 0 });

            const categories = CategoryModel.getAll();
            let successCount = 0;

            for (const tx of targets) {
                const suggestion = await aiService.suggestCategory(tx.description, categories);
                if (suggestion && suggestion.category_id) {
                    TransactionModel.update(tx.id, {
                        suggested_category_id: suggestion.category_id,
                        confidence_score: Math.min(1, Math.max(0, suggestion.confidence || 0)),
                        status: 'pending'
                    });
                    successCount++;
                }
            }

            if (io) io.emit('transaction_updated', { type: 'auto_classify', count: successCount });
            res.json({ message: `Successfully classified ${successCount} transactions`, count: successCount });
        } catch (error) {
            console.error('Auto classify error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/chat', auth.authenticate, async (req, res) => {
        try {
            const { message, history } = req.body;

            // Get current month stats to provide context to AI
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const today = now.toISOString().split('T')[0];

            const stats = TransactionModel.getStats({ start_date: startOfMonth, end_date: today });
            const categories = TransactionModel.getCategoryStats({ start_date: startOfMonth, end_date: today });

            const financialContext = `
Thông tin tài chính hiện tại (Tháng ${now.getMonth() + 1}/${now.getFullYear()}):
- Tổng thu: ${stats.total_income.toLocaleString('vi-VN')} đ
- Tổng chi: ${stats.total_expense.toLocaleString('vi-VN')} đ
- Số dư: ${(stats.total_income - stats.total_expense).toLocaleString('vi-VN')} đ
- Chi tiết theo danh mục: ${categories.map(c => `${c.category_name}: ${c.total.toLocaleString('vi-VN')} đ`).join(', ')}
            `.trim();

            const context = [
                {
                    role: 'system',
                    content: `Bạn là trợ lý tài chính thông minh của ứng dụng iFinance. 
                    Hãy giúp người dùng phân tích dữ liệu dựa trên thông tin sau đây:
                    ${financialContext}

                    Lưu ý: Chỉ trả lời dựa trên dữ liệu được cung cấp. Nếu người dùng hỏi về thông tin không có trong dữ liệu, hãy lịch sự thông báo.`
                },
                ...(history || []),
                { role: 'user', content: message }
            ];

            const reply = await aiService.callLLM(context);
            res.json({ reply });
        } catch (error) {
            console.error('AI Chat error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // ─── Settings & Bot Info ───────────────────────────────────────────────────

    router.get('/settings', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const settings = {
                ai_storage_path: SettingModel.get('ai_storage_path'),
                ai_model_name: SettingModel.get('ai_model_name') || 'Qwen2.5-1.5B',
                ai_enabled: SettingModel.get('ai_enabled') === 'true'
            };
            res.json(settings);
        } catch (error) {
            console.error('Get AI settings error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/settings', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const { ai_storage_path, ai_model_name, ai_enabled } = req.body;
            if (ai_storage_path !== undefined) {
                if (ai_storage_path !== '') {
                    aiManager.validateStoragePath(ai_storage_path); // Throw if invalid
                }
                SettingModel.set('ai_storage_path', ai_storage_path);
            }
            if (ai_model_name !== undefined) SettingModel.set('ai_model_name', ai_model_name);
            if (ai_enabled !== undefined) SettingModel.set('ai_enabled', String(ai_enabled));

            res.json({ message: 'AI Settings updated successfully' });
        } catch (error) {
            console.error('Update AI settings error:', error.message);
            res.status(400).json({ error: error.message });
        }
    });

    router.get('/bot-info', auth.authenticate, (req, res) => {
        try {
            const info = {
                enabled: !!telegramService,
                name: telegramService?.botInfo?.first_name || 'iFinance Bot',
                username: telegramService?.botInfo?.username || 'ifinance_bot',
                status: telegramService ? 'Running' : 'Disabled'
            };
            res.json(info);
        } catch (error) {
            console.error('Get bot info error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};