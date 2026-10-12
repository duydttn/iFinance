const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

module.exports = () => ({
    /**
     * Encrypts a file using AES-256-CBC
     * P-08 fix: salt không còn cố định — kết hợp secretKey để chống rainbow table
     */
    async encryptData(inputPath, password, secretKey = '') {
        return new Promise((resolve, reject) => {
            try {
                const input = fs.readFileSync(inputPath);
                // Dùng secretKey như một phần của salt để tăng entropy
                const salt = `salt-ifinance-${secretKey || 'default'}`;
                const key = crypto.scryptSync(password, salt, 32);
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                const encrypted = Buffer.concat([iv, cipher.update(input), cipher.final()]);
                resolve(encrypted);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Syncs the database to a cloud endpoint
     */
    async syncToCloud(dbPath, config) {
        if (!config.url) throw new Error('Cloud URL is not configured');

        try {
            const encryptedData = await this.encryptData(dbPath, config.password || 'default-p@ss', config.secretKey || '');
            const response = await axios.post(config.url, encryptedData, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'X-Backup-Secret': config.secretKey,
                    'X-Backup-Filename': `ifinance_backup_${new Date().toISOString().split('T')[0]}.enc`
                },
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('Cloud Sync Error:', error.message);
            throw error;
        }
    }
});