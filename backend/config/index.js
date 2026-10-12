'use strict';

const config = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',

  DB_PATH: process.env.DB_PATH || null, // null → database/connection.js uses its default

  CORS_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3500',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3500',
    'https://ifinance.vz5dev.online',
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
  ],

  // Rate limiting (global API)
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900_000, // 15 min
    MAX: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5000,
  },

  // Rate limiting (auth endpoints)
  AUTH_RATE_LIMIT: {
    WINDOW_MS: 900_000,
    MAX: 15,
  },

  // AI
  AI_API_URL: process.env.AI_API_URL || 'http://127.0.0.1:1234/v1',

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || null,
};

module.exports = config;