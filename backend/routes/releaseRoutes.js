const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const multer = require('multer');
const crypto = require('crypto');

module.exports = function(container) {
  const router = express.Router();
  const db = require('../database/connection');
  const releaseDir = path.join(__dirname, '../../release');

  // Ensure release directory exists
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  // Multer config for file upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, releaseDir),
    filename: (req, file, cb) => {
      // If version is provided in body, use naming convention
      const version = req.body.version;
      if (version) {
        cb(null, `iFinance Setup ${version}.exe`);
      } else {
        cb(null, file.originalname);
      }
    }
  });
  const upload = multer({ storage: storage });

  // Helper to check if installer exists
  const getInstallerInfo = (version) => {
    const filename = `iFinance Setup ${version}.exe`;
    const filePath = path.join(releaseDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        filename: filename,
        size: stats.size,
        path: `/updates/${filename}`
      };
    }
    return { exists: false };
  };

  // Get all releases
  router.get('/', (req, res) => {
    try {
      const releases = db.prepare('SELECT * FROM releases ORDER BY created_at DESC').all();
      const enrichedReleases = releases.map(r => ({
        ...r,
        installer: getInstallerInfo(r.version)
      }));
      res.json(enrichedReleases);
    } catch (error) {
      console.error('Error fetching releases:', error);
      res.status(500).json({ error: 'Failed to fetch releases' });
    }
  });

  // Helper to calculate SHA512 of a file
  const calculateHash = (filePath) => {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha512');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  };

  // Add new release (optionally with file)
  router.post('/', (req, res) => {
    upload.single('installer')(req, res, async (err) => {
      if (err) {
        console.error('Multer Upload Error:', err);
        return res.status(500).json({ error: `Upload failed: ${err.message}` });
      }

      const { version, release_notes } = req.body;
      if (!version) return res.status(400).json({ error: 'Version is required' });

      let sha512 = null;
      let size = null;

      if (req.file) {
        try {
          sha512 = await calculateHash(req.file.path);
          size = req.file.size;
        } catch (hashErr) {
          console.error('Hash calculation failed:', hashErr);
        }
      }

      try {
        const stmt = db.prepare('INSERT INTO releases (version, release_notes, sha512, size) VALUES (?, ?, ?, ?)');
        const info = stmt.run(version, release_notes || '', sha512, size);
        const newRelease = db.prepare('SELECT * FROM releases WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json({ ...newRelease, installer: getInstallerInfo(version) });
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          res.status(400).json({ error: 'Version already exists' });
        } else {
          console.error('Database Error after upload:', error);
          res.status(500).json({ error: 'Failed to add release metadata' });
        }
      }
    });
  });

  // Delete release
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    try {
      const release = db.prepare('SELECT * FROM releases WHERE id = ?').get(id);
      if (!release) return res.status(404).json({ error: 'Release not found' });

      // Delete the installer file if it exists
      const installer = getInstallerInfo(release.version);
      if (installer.exists) {
        try {
          fs.unlinkSync(path.join(releaseDir, installer.filename));
        } catch (e) {
          console.error('Failed to delete installer file:', e);
        }
      }

      db.prepare('DELETE FROM releases WHERE id = ?').run(id);
      res.json({ message: 'Release deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete release' });
    }
  });

  // Dynamic latest.yml interceptor for electron-updater
  router.get('/latest-dynamic.yml', (req, res) => {
    try {
      const current = db.prepare('SELECT * FROM releases WHERE is_current = 1 LIMIT 1').get();
      if (!current) {
        return res.status(404).send('No current release set');
      }

      const installer = getInstallerInfo(current.version);
      if (!installer.exists) {
        return res.status(404).send(`Installer for v${current.version} not found on server`);
      }

      const diskLatestPath = path.join(releaseDir, 'latest.yml');
      if (fs.existsSync(diskLatestPath)) {
        const content = fs.readFileSync(diskLatestPath, 'utf8');
        const data = yaml.load(content);
        if (data.version === current.version) {
          return res.type('text/yaml').send(content);
        }
      }

      const fallbackYml = {
        version: current.version,
        files: [{
          url: installer.filename,
          sha512: 'manual-update-required-hash-mismatch',
          size: installer.size
        }],
        path: installer.filename,
        sha512: 'manual-update-required-hash-mismatch',
        releaseDate: new Date().toISOString()
      };
      res.type('text/yaml').send(yaml.dump(fallbackYml));
    } catch (error) {
      res.status(500).send('Error generating latest.yml');
    }
  });

  // Get current release
  router.get('/current', (req, res) => {
    try {
      const current = db.prepare('SELECT * FROM releases WHERE is_current = 1 LIMIT 1').get();
      res.json(current || null);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch current release' });
    }
  });

  // Set a release as current
  router.put('/:id/current', (req, res) => {
    const id = req.params.id;
    try {
      const transaction = db.transaction(() => {
        db.prepare('UPDATE releases SET is_current = 0').run();
        const info = db.prepare('UPDATE releases SET is_current = 1 WHERE id = ?').run(id);
        return info.changes;
      });

      const changes = transaction();
      if (changes === 0) return res.status(404).json({ error: 'Release not found' });
      res.json({ message: 'Release set as current successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update release' });
    }
  });

  return router;
};

