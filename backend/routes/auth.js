const express = require('express');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

module.exports = (container) => {
    const router = express.Router();
    const UserModel = container.resolve('UserModel');
    const AuditLogModel = container.resolve('AuditLogModel');
    const authService = container.resolve('authService');

    router.post('/login', validate(schemas.login), async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = UserModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValid = await authService.comparePassword(password, user.password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = authService.generateToken(user);

            AuditLogModel.log(user.id, 'LOGIN', 'user', user.id, null, req.ip);

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/register',
        auth.authenticate,
        auth.authorize('Admin'),
        validate(schemas.createUser),
        async (req, res) => {
            try {
                const { username, password, role, note, team } = req.body;

                const existing = UserModel.findByUsername(username);
                if (existing) {
                    return res.status(400).json({ error: 'Username already exists' });
                }

                const passwordHash = await authService.hashPassword(password);
                const userId = UserModel.create(username, passwordHash, role, note, team);

                AuditLogModel.log(req.user.id, 'CREATE_USER', 'user', userId, { username, role, note, team }, req.ip);

                res.status(201).json({ id: userId, username, role, note, team });
            } catch (error) {
                console.error('Register error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.get('/me', auth.authenticate, (req, res) => {
        res.json({ user: req.user });
    });

    router.get('/users',
        auth.authenticate,
        auth.authorize('Admin'),
        (_req, res) => {
            try {
                const users = UserModel.getAll();
                res.json({ users });
            } catch (error) {
                console.error('Get users error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.post('/telegram-chat-id',
        auth.authenticate,
        validate(schemas.updateTelegramChatId),
        (req, res) => {
            try {
                const { telegram_chat_id } = req.body;
                UserModel.updateChatId(req.user.id, telegram_chat_id);
                AuditLogModel.log(req.user.id, 'UPDATE_TELEGRAM_CHAT_ID', 'user', req.user.id, { telegram_chat_id }, req.ip);
                res.json({ message: 'Telegram Chat ID updated successfully' });
            } catch (error) {
                console.error('Update telegram chat ID error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.post('/change-password',
        auth.authenticate,
        validate(schemas.changePassword),
        async (req, res) => {
            try {
                const { oldPassword, newPassword } = req.body;
                const fullUser = UserModel.findByUsername(req.user.username);
                const isValid = await authService.comparePassword(oldPassword, fullUser.password_hash);

                if (!isValid) {
                    return res.status(400).json({ error: 'Mật khẩu cũ không chính xác' });
                }

                const newHash = await authService.hashPassword(newPassword);
                UserModel.updatePassword(req.user.id, newHash);
                AuditLogModel.log(req.user.id, 'CHANGE_PASSWORD', 'user', req.user.id, null, req.ip);
                res.json({ message: 'Đổi mật khẩu thành công' });
            } catch (error) {
                console.error('Change password error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.put('/users/:id/team',
        auth.authenticate,
        auth.authorize('Admin'),
        (req, res) => {
            try {
                const { team } = req.body;
                UserModel.updateTeam(req.params.id, team);
                AuditLogModel.log(req.user.id, 'UPDATE_USER_TEAM', 'user', req.params.id, { team }, req.ip);
                res.json({ message: 'Cập nhật nhóm thành công' });
            } catch (error) {
                console.error('Update team error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.put('/users/:id/note',
        auth.authenticate,
        auth.authorize('Admin'),
        (req, res) => {
            try {
                const { note } = req.body;
                UserModel.updateNote(req.params.id, note);
                AuditLogModel.log(req.user.id, 'UPDATE_USER_NOTE', 'user', req.params.id, { note }, req.ip);
                res.json({ message: 'Cập nhật ghi chú thành công' });
            } catch (error) {
                console.error('Update note error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.put('/users/:id/role',
        auth.authenticate,
        auth.authorize('Admin'),
        (req, res) => {
            try {
                const { role } = req.body;
                if (!['Admin', 'Accountant', 'Viewer'].includes(role)) {
                    return res.status(400).json({ error: 'Invalid role' });
                }
                UserModel.updateRole(req.params.id, role);
                AuditLogModel.log(req.user.id, 'UPDATE_USER_ROLE', 'user', req.params.id, { role }, req.ip);
                res.json({ message: 'Cập nhật quyền thành công' });
            } catch (error) {
                console.error('Update role error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    router.delete('/users/:id',
        auth.authenticate,
        auth.authorize('Admin'),
        (req, res) => {
            try {
                if (parseInt(req.params.id) === req.user.id) {
                    return res.status(400).json({ error: 'Không thể tự xóa chính mình' });
                }
                UserModel.delete(req.params.id);
                AuditLogModel.log(req.user.id, 'DELETE_USER', 'user', req.params.id, null, req.ip);
                res.json({ message: 'Xóa tài khoản thành công' });
            } catch (error) {
                console.error('Delete user error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );

    return router;
};
