const express = require('express');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

module.exports = (container) => {
    const router = express.Router();
    const CategoryModel = container.resolve('CategoryModel');
    const AuditLogModel = container.resolve('AuditLogModel');

    router.get('/', auth.authenticate, (req, res) => {
        try {
            const scope = req.query.scope;
            const categories = CategoryModel.getAll(scope);
            res.json({ categories });
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/', auth.authenticate, auth.authorize('Admin'), validate(schemas.createCategory), (req, res) => {
        try {
            const id = CategoryModel.create(req.body);
            AuditLogModel.log(req.user.id, 'CREATE_CATEGORY', 'category', id, req.body, req.ip);
            res.status(201).json({ id });
        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.put('/:id', auth.authenticate, auth.authorize('Admin'), validate(schemas.updateCategory), (req, res) => {
        try {
            CategoryModel.update(req.params.id, req.body);
            AuditLogModel.log(req.user.id, 'UPDATE_CATEGORY', 'category', req.params.id, req.body, req.ip);
            res.json({ message: 'Category updated successfully' });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.delete('/:id', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            CategoryModel.delete(req.params.id);
            AuditLogModel.log(req.user.id, 'DELETE_CATEGORY', 'category', req.params.id, null, req.ip);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
