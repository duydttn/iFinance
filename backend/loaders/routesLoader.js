'use strict';

/**
 * Routes Loader
 * Mounts all API routes and registers the global error handler.
 * To add a new route: require it here and add one app.use() line. That's it.
 * @param {import('express').Application} app
 */
module.exports = function routesLoader(app) {
  const container = app.get('container');

  // ── API Routes (Passed Container for @inject behavior) ──────────────────────
  app.use('/api/auth', require('../routes/auth')(container));
  app.use('/api/transactions', require('../routes/transactions')(container));
  app.use('/api/categories', require('../routes/categories')(container));
  app.use('/api/rules', require('../routes/rules')(container));
  app.use('/api/audit-logs', require('../routes/auditLogs')(container));
  app.use('/api/ai', require('../routes/ai')(container));
  app.use('/api/backup', require('../routes/backup')(container));
  app.use('/api/settings', require('../routes/settings')(container));
  app.use('/api/releases', require('../routes/releaseRoutes')(container));

  // ── Health Check ────────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // ── Global Error Handler ────────────────────────────────────────────────────
  app.use((err, _req, res, _next) => {
    console.error('[Error]', err.stack || err.message);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      error: app.get('env') === 'production'
        ? 'Something went wrong!'
        : err.message,
    });
  });
};