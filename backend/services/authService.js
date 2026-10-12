const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (UserModel, config) => ({
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    },

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    },

    generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });
    },

    verifyToken(token) {
        try {
            return jwt.verify(token, config.JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    async authenticate(token) {
        const decoded = this.verifyToken(token);
        if (!decoded) return null;

        const user = UserModel.findById(decoded.id);
        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            team: user.team,
            telegram_chat_id: user.telegram_chat_id
        };
    }
});
