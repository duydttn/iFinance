const express = require('express');
const auth = require('../middleware/auth');

module.exports = (container) => {
    const router = express.Router();
    const AuditLogModel = container.resolve('AuditLogModel');

    router.get('/', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const filters = {
                user_id: req.query.user_id,
                action: req.query.action,
                entity_type: req.query.entity_type,
                limit: req.query.limit,
                offset: req.query.offset
            };

            const logs = AuditLogModel.getAll(filters);
            const total = AuditLogModel.count(filters);

            res.json({ logs, total });
        } catch (error) {
            console.error('Get audit logs error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
