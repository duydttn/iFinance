const express = require('express');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

module.exports = (container) => {
    const router = express.Router();
    const config = container.resolve('config');
    const db = container.resolve('db');
    const AuditLogModel = container.resolve('AuditLogModel');
    const backupService = container.resolve('backupService');
    const SettingModel = container.resolve('SettingModel');

    router.get('/export', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const backupDir = path.join(__dirname, '../../backups');
            if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

            const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`;
            const filePath = path.join(backupDir, fileName);

            db.prepare('VACUUM INTO ?').run(filePath);

            AuditLogModel.log(req.user.id, 'BACKUP_CREATED', 'system', null, { fileName }, req.ip);

            res.download(filePath, fileName, (err) => {
                if (err) console.error('Backup download error:', err);
            });
        } catch (error) {
            console.error('Backup error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/cloud', auth.authenticate, auth.authorize('Admin'), async (req, res) => {
        try {
            const cloudConfig = {
                url: SettingModel.get('backup_cloud_url'),
                secretKey: SettingModel.get('backup_cloud_secret'),
                password: SettingModel.get('backup_password')
            };

            if (!cloudConfig.url) return res.status(400).json({ error: 'Cloud backup is not configured' });

            const tempPath = path.join(__dirname, '../../backups/temp_sync.sqlite');
            if (!fs.existsSync(path.dirname(tempPath))) fs.mkdirSync(path.dirname(tempPath), { recursive: true });

            db.prepare('VACUUM INTO ?').run(tempPath);

            let result;
            try {
                result = await backupService.syncToCloud(tempPath, cloudConfig);
            } finally {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }

            AuditLogModel.log(req.user.id, 'BACKUP_CLOUD_SYNC', 'system', null, { result }, req.ip);
            res.json({ message: 'Cloud sync successful', result });
        } catch (error) {
            console.error('Cloud backup error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/status', auth.authenticate, auth.authorize('Admin'), (req, res) => {
        try {
            const backupDir = path.join(__dirname, '../../backups');
            let lastLocal = null;
            if (fs.existsSync(backupDir)) {
                const files = fs.readdirSync(backupDir)
                    .filter(f => f.endsWith('.sqlite'))
                    .map(f => ({
                        name: f,
                        time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
                        size: fs.statSync(path.join(backupDir, f)).size
                    }))
                    .sort((a, b) => b.time - a.time);
                
                if (files.length > 0) lastLocal = files[0];
            }

            res.json({
                last_local_backup: lastLocal,
                cloud_configured: !!SettingModel.get('backup_cloud_url')
            });
        } catch (error) {
            console.error('Get backup status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
