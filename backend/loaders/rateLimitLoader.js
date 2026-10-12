'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config');

module.exports = function rateLimitLoader(app) {
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    max: config.RATE_LIMIT.MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
  });

  const authLimiter = rateLimit({
    windowMs: config.AUTH_RATE_LIMIT.WINDOW_MS,
    max: config.AUTH_RATE_LIMIT.MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later.',
  });

  app.use('/api/', limiter);
  app.use('/api/auth', authLimiter);
};
