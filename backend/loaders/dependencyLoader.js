'use strict';

const container = require('./container');
const db = require('../database/connection');
const config = require('../config');

// Models
const UserModelFactory = require('../models/User');
const TransactionModelFactory = require('../models/Transaction');
const CategoryModelFactory = require('../models/Category');
const RuleModelFactory = require('../models/Rule');
const SettingModelFactory = require('../models/Setting');
const AuditLogModelFactory = require('../models/AuditLog');

// Services
const AuthServiceFactory = require('../services/authService');
const AIServiceFactory = require('../services/aiService');
const ClassifierServiceFactory = require('../services/classifier');
const AIManagerFactory = require('../services/aiManager');
const TelegramServiceFactory = require('../services/telegramService');
const AnomalyDetectorFactory = require('../services/anomalyDetector');
const BackupServiceFactory = require('../services/BackupService');
const TaxServiceFactory = require('../services/TaxService');

/**
 * Dependency Loader
 * Initializes all models and services, resolving their dependencies.
 * Registers everything into the DI Container.
 */
module.exports = async (app) => {
    // 1. Register Core Utils
    container.register('db', db);
    container.register('config', config);
    container.register('io', app.get('io'));

    // 2. Initialize & Register Models
    const UserModel = UserModelFactory(db);
    const TransactionModel = TransactionModelFactory(db);
    const CategoryModel = CategoryModelFactory(db);
    const RuleModel = RuleModelFactory(db);
    const SettingModel = SettingModelFactory(db);
    const AuditLogModel = AuditLogModelFactory(db);

    container.register('UserModel', UserModel);
    container.register('TransactionModel', TransactionModel);
    container.register('CategoryModel', CategoryModel);
    container.register('RuleModel', RuleModel);
    container.register('SettingModel', SettingModel);
    container.register('AuditLogModel', AuditLogModel);

    // 3. Initialize & Register Services
    const authService = AuthServiceFactory(UserModel, config);
    const aiService = AIServiceFactory(config);
    const classifierService = ClassifierServiceFactory(db);
    const aiManager = AIManagerFactory(SettingModel, config);
    const anomalyDetector = AnomalyDetectorFactory(TransactionModel);
    const backupService = BackupServiceFactory();

    container.register('authService', authService);
    container.register('aiService', aiService);
    container.register('classifierService', classifierService);
    container.register('aiManager', aiManager);
    container.register('anomalyDetector', anomalyDetector);
    container.register('backupService', backupService);

    const taxService = TaxServiceFactory(TransactionModel);
    container.register('taxService', taxService);

    // 4. Final Wiring (Side effects that need io)
    const io = app.get('io');
    if (io) {
        aiManager.setSocket(io);
    }

    // 5. Initialize Telegram Service (needs many dependencies)
    const telegramService = TelegramServiceFactory({
        TransactionModel,
        ClassifierService: classifierService,
        AuditLogModel,
        UserModel,
        AIService: aiService,
        db,
        config,
        io
    });
    container.register('telegramService', telegramService);

    console.log('✅ Dependency Injection Container initialized');

    app.set('container', container);

    return container;
};
