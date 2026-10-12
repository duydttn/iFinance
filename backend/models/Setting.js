module.exports = (db) => ({
    getAll() {
        const rows = db.prepare('SELECT key, value FROM settings').all();
        return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    },

    get(key) {
        return db.prepare('SELECT value FROM settings WHERE key = ?').get(key)?.value;
    },

    set(key, value) {
        db.prepare(`
            INSERT INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `).run(key, value);
    }
});
