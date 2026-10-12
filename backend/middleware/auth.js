const auth = {
    /**
     * Authenticate Middleware
     * Resolves authService from the container to verify the token.
     */
    async authenticate(req, res, next) {
        const container = req.app.get('container');
        const authService = container.resolve('authService');
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const user = await authService.authenticate(token);

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    },

    /**
     * Authorize Middleware
     * Checks if the authenticated user has the required role.
     */
    authorize(...allowedRoles) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        };
    }
};

module.exports = auth;