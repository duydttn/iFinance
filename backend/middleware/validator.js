const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }

        next();
    };
};

const schemas = {
    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),

    createUser: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('Admin', 'User', 'Accountant', 'Viewer').required(),
        note: Joi.string().optional().allow(null, ''),
        team: Joi.string().optional().allow(null, '')
    }),

    updateUser: Joi.object({
        role: Joi.string().valid('Admin', 'User', 'Accountant', 'Viewer').optional(),
        note: Joi.string().optional().allow(null, ''),
        team: Joi.string().optional().allow(null, '')
    }),

    createTransaction: Joi.object({
        date: Joi.date().required(),
        description: Joi.string().required(),
        amount: Joi.number().positive().required(),
        type: Joi.string().valid('income', 'expense').required(),
        scope: Joi.string().valid('personal', 'business').required(),
        category_id: Joi.number().integer().optional().allow(null),
        source: Joi.string().optional().allow(null, ''),
        tax_rate: Joi.number().min(0).max(100).optional().default(0),
        tax_amount: Joi.number().min(0).optional().default(0),
        invoice_no: Joi.string().optional().allow(null, ''),
        partner_name: Joi.string().optional().allow(null, ''),
        is_anomaly: Joi.boolean().optional().default(false),
        anomaly_note: Joi.string().optional().allow(null, '')
    }),

    updateTransaction: Joi.object({
        date: Joi.date().optional(),
        description: Joi.string().optional(),
        amount: Joi.number().positive().optional(),
        type: Joi.string().valid('income', 'expense').optional(),
        scope: Joi.string().valid('personal', 'business').optional(),
        category_id: Joi.number().integer().optional().allow(null),
        status: Joi.string().valid('pending', 'confirmed').optional(),
        source: Joi.string().optional().allow(null, ''),
        tax_rate: Joi.number().min(0).max(100).optional(),
        tax_amount: Joi.number().min(0).optional(),
        invoice_no: Joi.string().optional().allow(null, ''),
        partner_name: Joi.string().optional().allow(null, ''),
        team: Joi.string().optional().allow(null, ''),
        is_anomaly: Joi.boolean().optional(),
        anomaly_note: Joi.string().optional().allow(null, '')
    }),

    createCategory: Joi.object({
        name: Joi.string().required(),
        scope: Joi.string().valid('personal', 'business', 'both').required()
    }),

    updateTelegramChatId: Joi.object({
        telegram_chat_id: Joi.string().allow(null, '').optional()
    }),

    changePassword: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    }),

    createRule: Joi.object({
        keyword: Joi.string().min(1).required(),
        category_id: Joi.number().integer().positive().required(),
        scope: Joi.string().valid('personal', 'business', 'both').required(),
        priority: Joi.number().integer().min(0).default(1)
    }),

    updateRule: Joi.object({
        keyword: Joi.string().min(1).optional(),
        category_id: Joi.number().integer().positive().optional(),
        scope: Joi.string().valid('personal', 'business', 'both').optional(),
        priority: Joi.number().integer().min(0).optional()
    })
};

module.exports = { validate, schemas };
