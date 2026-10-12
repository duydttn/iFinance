'use strict';

const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const config = require('../config');

module.exports = function expressLoader(app) {
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use((req, res, next) => {
    const isElectron = req.headers['user-agent'] && req.headers['user-agent'].toLowerCase().includes('electron');
    cors({
      origin: (origin, callback) => {
        if (!origin || (origin === 'null' && isElectron) || config.CORS_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin "${origin}" not allowed`));
        }
      },
      credentials: true,
    })(req, res, next);
  });

  app.use(express.json({ limit: '2000mb' }));
  app.use(express.urlencoded({ limit: '2000mb', extended: true }));

  // Serve static files from React app
  app.use(express.static(path.join(__dirname, '../../client/dist')));


  app.get('/updates/latest.yml', (req, res, next) => {
    const db = require('../database/connection');
    const fs = require('fs');
    const yaml = require('js-yaml');
    const releaseDir = path.join(__dirname, '../../release');

    try {
      const current = db.prepare('SELECT * FROM releases WHERE is_current = 1 LIMIT 1').get();
      if (current) {
        const diskLatestPath = path.join(releaseDir, 'latest.yml');
        if (fs.existsSync(diskLatestPath)) {
          const content = fs.readFileSync(diskLatestPath, 'utf8');
          const data = yaml.load(content);
          // If the disk latest.yml is already what we want, just serve it
          if (data.version === current.version) {
            return res.type('text/yaml').send(content);
          }

          // Use DB values if disk latest.yml doesn't match or is generic
          data.version = current.version;
          data.path = `iFinance Setup ${current.version}.exe`;

          if (current.sha512) {
            data.sha512 = current.sha512;
            if (data.files && data.files[0]) {
              data.files[0].url = data.path;
              data.files[0].sha512 = current.sha512;
              data.files[0].size = current.size || data.files[0].size;
            }
          }
          return res.type('text/yaml').send(yaml.dump(data));
        }
      }
    } catch (e) {
      console.error('Dynamic YML error:', e);
    }
    next();
  });

  app.use('/updates', express.static(path.join(__dirname, '../../release')));
};