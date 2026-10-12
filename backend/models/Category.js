module.exports = (db) => ({
    create(name, type, icon = null, color = null) {
        const stmt = db.prepare(
            'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(name, type, icon, color);
        return result.lastInsertRowid;
    },

    getAll(type = null) {
        let query = 'SELECT * FROM categories';
        const params = [];
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY name ASC';
        const stmt = db.prepare(query);
        return stmt.all(...params);
    },

    findById(id) {
        const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
        return stmt.get(id);
    },

    delete(id) {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        return stmt.run(id);
    }
});