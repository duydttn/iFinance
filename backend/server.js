'use strict';

require('dotenv').config();

const config = require('./config');
const createApp = require('./app');

/**
 * server.js — Entry Point
 */
async function start() {
    try {
        const { app, server } = await createApp();
        const container = app.get('container');
        const aiManager = container.resolve('aiManager');

        server.listen(config.PORT, () => {
            console.log(`🚀 iFinance API running on port ${config.PORT}`);
            console.log(`📦 Environment: ${config.NODE_ENV}`);

            setTimeout(() => {
                const status = aiManager.getStatus();
                if (status.engineExists && status.modelExists) {
                    console.log('🤖 Starting AI Studio Engine in background...');
                    aiManager.startServer();
                }
            }, 5000);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

start();