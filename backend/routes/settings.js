const express = require('express');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

module.exports = (container) => {
    const router = express.Router();
    const SettingModel = container.resolve('SettingModel');
    const AuditLogModel = container.resolve('AuditLogModel');

    router.get('/', auth.authenticate, (req, res) => {
        try {
            const settings = SettingModel.getAll();
            res.json({ settings });
        } catch (error) {
            console.error('Get settings error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const { key, value, ...rest } = req.body;
            
            if (key !== undefined && value !== undefined) {
                // Single setting update
                SettingModel.set(key, value);
                AuditLogModel.log(req.user.id, 'UPDATE_SETTING', 'setting', key, { value }, req.ip);
            } else {
                // Bulk setting update (object of key:value pairs)
                const updates = { ...(key !== undefined ? { [key]: value } : {}), ...rest };
                for (const [k, v] of Object.entries(updates)) {
                    SettingModel.set(k, v);
                    AuditLogModel.log(req.user.id, 'UPDATE_SETTING', 'setting', k, { value: v }, req.ip);
                }
            }
            
            res.json({ message: 'Settings updated successfully' });
        } catch (error) {
            console.error('Update setting error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/:key', auth.authenticate, (req, res) => {
        try {
            const value = SettingModel.get(req.params.key);
            res.json({ key: req.params.key, value });
        } catch (error) {
            console.error('Get setting error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};