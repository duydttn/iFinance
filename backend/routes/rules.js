const express = require('express');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

module.exports = (container) => {
    const router = express.Router();
    const RuleModel = container.resolve('RuleModel');
    const AuditLogModel = container.resolve('AuditLogModel');

    router.get('/', auth.authenticate, (req, res) => {
        try {
            const rules = RuleModel.getAll();
            res.json({ rules });
        } catch (error) {
            console.error('Get rules error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/', auth.authenticate, auth.authorize('Admin'), validate(schemas.createRule), (req, res) => {
        try {
            const { keyword, category_id, scope, priority } = req.body;
            const id = RuleModel.create(keyword, category_id, scope, priority);
            AuditLogModel.log(req.user.id, 'CREATE_RULE', 'rule', id, req.body, req.ip);
            res.status(201).json({ id });
        } catch (error) {
            console.error('Create rule error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.put('/:id', auth.authenticate, auth.authorize('Admin'), validate(schemas.updateRule), (req, res) => {
        try {
            const id = req.params.id;
            const existing = RuleModel.findById(id);
            if (!existing) return res.status(404).json({ error: 'Rule not found' });

            const keyword = req.body.keyword ?? existing.keyword;
            const category_id = req.body.category_id ?? existing.category_id;
            const scope = req.body.scope ?? existing.scope;
            const priority = req.body.priority ?? existing.priority;

            RuleModel.update(id, keyword, category_id, scope, priority);
            AuditLogModel.log(req.user.id, 'UPDATE_RULE', 'rule', id, req.body, req.ip);
            res.json({ message: 'Rule updated successfully' });
        } catch (error) {
            console.error('Update rule error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.delete('/:id', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            RuleModel.delete(req.params.id);
            AuditLogModel.log(req.user.id, 'DELETE_RULE', 'rule', req.params.id, null, req.ip);
            res.json({ message: 'Rule deleted successfully' });
        } catch (error) {
            console.error('Delete rule error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
