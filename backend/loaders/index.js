'use strict';

const expressLoader = require('./expressLoader');
const rateLimitLoader = require('./rateLimitLoader');
const socketLoader = require('./socketLoader');
const dependencyLoader = require('./dependencyLoader');
const routesLoader = require('./routesLoader');

module.exports = async function initLoaders(app) {
  // 1. Basic Express & Security
  expressLoader(app);
  rateLimitLoader(app);

  // 2. Sockets & HTTP Server (needed for io)
  const { server, io } = socketLoader(app);

  // 3. Dependency Injection (Wires up models/services)
  await dependencyLoader(app);

  // 4. Routes (Mounts after DI is ready)
  routesLoader(app);

  // 4.5 Migration: Add hash and size to releases
  const db = require('../database/connection');
  try {
    const tableInfo = db.prepare("PRAGMA table_info(releases)").all();
    if (!tableInfo.some(c => c.name === 'sha512')) {
      db.prepare("ALTER TABLE releases ADD COLUMN sha512 TEXT").run();
      db.prepare("ALTER TABLE releases ADD COLUMN size INTEGER").run();
    }
    
    const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
    if (!userTableInfo.some(c => c.name === 'note')) {
      db.prepare("ALTER TABLE users ADD COLUMN note TEXT").run();
    }
    if (!userTableInfo.some(c => c.name === 'team')) {
      db.prepare("ALTER TABLE users ADD COLUMN team TEXT").run();
    }

    const txTableInfo = db.prepare("PRAGMA table_info(transactions)").all();
    if (!txTableInfo.some(c => c.name === 'team')) {
      db.prepare("ALTER TABLE transactions ADD COLUMN team TEXT").run();
    }
    if (!txTableInfo.some(c => c.name === 'is_anomaly')) {
      db.prepare("ALTER TABLE transactions ADD COLUMN is_anomaly INTEGER DEFAULT 0").run();
    }
    if (!txTableInfo.some(c => c.name === 'anomaly_note')) {
      db.prepare("ALTER TABLE transactions ADD COLUMN anomaly_note TEXT").run();
    }
  } catch (e) {
    console.error('Migration failed:', e.message);
  }

  // 5. Auto-register current version from package.json
  try {
    const pkg = require('../../package.json');
    const db = require('../database/connection');
    const version = pkg.version;
    const exists = db.prepare('SELECT id FROM releases WHERE version = ?').get(version);
    if (!exists) {
      db.prepare('INSERT INTO releases (version, release_notes, is_current) VALUES (?, ?, 1)')
        .run(version, 'Phiên bản đang chạy hệ thống (Tự động cập nhật)');
      db.prepare('UPDATE releases SET is_current = 0 WHERE version != ?').run(version);
    }
  } catch (err) {
    console.error('Auto-registration failed:', err.message);
  }

  // 6. SPA Fallback
  const path = require('path');
  app.get(/^(?!\/api|\/updates).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });

  return { server, io };
};