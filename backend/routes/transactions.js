const express = require('express');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

module.exports = (container) => {
    const router = express.Router();
    const TransactionModel = container.resolve('TransactionModel');
    const CategoryModel = container.resolve('CategoryModel');
    const ClassifierService = container.resolve('classifierService');
    const AuditLogModel = container.resolve('AuditLogModel');
    const aiService = container.resolve('aiService');
    const anomalyDetector = container.resolve('anomalyDetector');
    const taxService = container.resolve('taxService');
    const db = container.resolve('db');

    router.get('/', auth.authenticate, (req, res) => {
        try {
            const filters = {
                type: req.query.type,
                scope: req.query.scope,
                status: req.query.status,
                category_id: req.query.category_id,
                start_date: req.query.start_date,
                end_date: req.query.end_date,
                search: req.query.search,
                limit: req.query.limit,
                offset: req.query.offset,
            };

            if (req.user.role !== 'Admin') {
                filters.applyTeamFilter = true;
                filters.team = req.user.team || null;
            } else if (req.query.team) {
                filters.team = req.query.team;
            }

            const transactions = TransactionModel.getAll(filters);
            const total = TransactionModel.count(filters);

            res.json({ transactions, total });
        } catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/', auth.authenticate, validate(schemas.createTransaction), async (req, res) => {
        try {
            const data = {
                ...req.body,
                created_by: req.user.id,
                team: req.user.team
            };

            if (!data.category_id) {
                const classification = ClassifierService.classifyTransaction(data.description, data.scope);
                if (ClassifierService.shouldSuggest(classification.confidence)) {
                    data.suggested_category_id = classification.category_id;
                    data.confidence_score = classification.confidence;
                    data.status = 'pending';
                }
            } else {
                data.status = 'confirmed';
            }

            const id = TransactionModel.create(data);
            AuditLogModel.log(req.user.id, 'CREATE_TRANSACTION', 'transaction', id, { amount: data.amount, type: data.type }, req.ip);

            const io = container.resolve('io');
            if (io) io.emit('transaction_updated', { type: 'create', id });

            res.status(201).json({ id });
        } catch (error) {
            console.error('Create transaction error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/stats', auth.authenticate, (req, res) => {
        try {
            const filters = {
                start_date: req.query.start_date,
                end_date: req.query.end_date,
                category_id: req.query.category_id,
                scope: req.query.scope,
            };
            if (req.user.role !== 'Admin') {
                filters.applyTeamFilter = true;
                filters.team = req.user.team || null;
            } else if (req.query.team) {
                filters.team = req.query.team;
            }
            const stats = TransactionModel.getStats(filters);
            const categoryStats = TransactionModel.getCategoryStats(filters);
            res.json({ stats, categoryStats });
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/anomalies', auth.authenticate, async (req, res) => {
        try {
            const team = req.user.role === 'Admin' ? req.query.team : req.user.team;
            const applyTeamFilter = req.user.role !== 'Admin';
            const anomalies = anomalyDetector.getAnomalousTransactions(
                req.query.start_date, 
                req.query.end_date, 
                team,
                applyTeamFilter
            );

            for (let i = 0; i < anomalies.length; i++) {
                if (!anomalies[i].ai_explanation) {
                    // RT-06 fix: dùng trực tiếp anomaly_details.average thay vì parse regex từ string tiếng Anh
                    const avg = anomalies[i].anomaly_details?.average || 0;
                    const explanation = await aiService.explainAnomaly(anomalies[i], avg);
                    TransactionModel.update(anomalies[i].id, { ai_explanation: explanation });
                    anomalies[i].ai_explanation = explanation;
                }
            }
            res.json({ anomalies });
        } catch (error) {
            console.error('Get anomalies error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/import', auth.authenticate, async (req, res) => {
        try {
            const { transactions } = req.body;
            if (!Array.isArray(transactions)) return res.status(400).json({ error: 'Invalid data' });

            const errors = [];
            let count = 0;

            for (let idx = 0; idx < transactions.length; idx++) {
                const tx = transactions[idx];
                // P-12: Validate từng transaction trước khi insert
                if (!tx.date || !tx.description || typeof tx.amount !== 'number' || tx.amount <= 0) {
                    errors.push({ index: idx, reason: 'Missing or invalid required fields (date, description, amount)' });
                    continue;
                }
                if (!['income', 'expense'].includes(tx.type)) {
                    errors.push({ index: idx, reason: `Invalid type: ${tx.type}` });
                    continue;
                }
                if (!['personal', 'business'].includes(tx.scope)) {
                    errors.push({ index: idx, reason: `Invalid scope: ${tx.scope}` });
                    continue;
                }
                TransactionModel.create({
                    ...tx,
                    created_by: req.user.id,
                    team: req.user.team,
                    status: tx.category_id ? 'confirmed' : 'pending'
                });
                count++;
            }

            AuditLogModel.log(req.user.id, 'IMPORT_TRANSACTIONS', 'transaction', null, { count, errors: errors.length }, req.ip);

            const io = container.resolve('io');
            if (io) io.emit('transaction_updated', { type: 'import', count });

            res.json({ message: `Successfully imported ${count} transactions`, count, errors });
        } catch (error) {
            console.error('Import error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/:id', auth.authenticate, (req, res) => {
        try {
            const transaction = TransactionModel.findById(req.params.id);
            if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
            res.json({ transaction });
        } catch (error) {
            console.error('Get transaction error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.put('/:id', auth.authenticate, validate(schemas.updateTransaction), (req, res) => {
        try {
            const id = req.params.id;
            const existing = TransactionModel.findById(id);
            if (!existing) return res.status(404).json({ error: 'Transaction not found' });

            TransactionModel.update(id, req.body);
            AuditLogModel.log(req.user.id, 'UPDATE_TRANSACTION', 'transaction', id, req.body, req.ip);

            const io = container.resolve('io');
            if (io) io.emit('transaction_updated', { type: 'update', id });

            res.json({ message: 'Transaction updated successfully' });
        } catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/:id/confirm', auth.authenticate, (req, res) => {
        try {
            const id = req.params.id;
            const transaction = TransactionModel.findById(id);
            if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
            if (transaction.status !== 'pending') return res.status(400).json({ error: 'Transaction not pending' });

            // P-11: Guard — không confirm nếu không có cả category_id lẫn suggested_category_id
            if (!transaction.category_id && !transaction.suggested_category_id) {
                return res.status(400).json({
                    error: 'Cannot confirm: transaction has no category or suggested category. Please assign a category first.'
                });
            }

            TransactionModel.update(id, {
                category_id: transaction.category_id || transaction.suggested_category_id,
                status: 'confirmed',
                team: transaction.team || req.user.team
            });

            AuditLogModel.log(req.user.id, 'CONFIRM_TRANSACTION', 'transaction', id, null, req.ip);

            const io = container.resolve('io');
            if (io) io.emit('transaction_updated', { type: 'confirm', id });

            res.json({ message: 'Transaction confirmed successfully' });
        } catch (error) {
            console.error('Confirm transaction error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.delete('/:id', auth.authenticate, (req, res) => {
        try {
            const id = req.params.id;
            const existing = TransactionModel.findById(id);
            if (!existing) return res.status(404).json({ error: 'Transaction not found' });

            TransactionModel.delete(id);
            AuditLogModel.log(req.user.id, 'DELETE_TRANSACTION', 'transaction', id, existing, req.ip);

            const io = container.resolve('io');
            if (io) io.emit('transaction_updated', { type: 'delete', id });

            res.json({ message: 'Transaction deleted successfully' });
        } catch (error) {
            console.error('Delete transaction error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/export/vn-purchase', auth.authenticate, async (req, res) => {
        try {
            const { start_date, end_date } = req.query;
            if (!start_date || !end_date) return res.status(400).json({ error: 'start_date and end_date are required' });
            const workbook = await taxService.generateVNPurchaseLedger(start_date, end_date);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=bang_ke_mua_vao_${start_date}_${end_date}.xlsx`);
            await workbook.xlsx.write(res);
        } catch (error) {
            console.error('Export VN Purchase error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/export/vn-sales', auth.authenticate, async (req, res) => {
        try {
            const { start_date, end_date } = req.query;
            if (!start_date || !end_date) return res.status(400).json({ error: 'start_date and end_date are required' });
            const workbook = await taxService.generateVNSalesLedger(start_date, end_date);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=bang_ke_ban_ra_${start_date}_${end_date}.xlsx`);
            await workbook.xlsx.write(res);
        } catch (error) {
            console.error('Export VN Sales error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
