module.exports = (db) => ({
    create(data) {
        const stmt = db.prepare(`
      INSERT INTO transactions 
      (date, description, amount, type, scope, category_id, source, status, 
       suggested_category_id, confidence_score, created_by, team, tax_rate, tax_amount, invoice_no, partner_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(
            data.date,
            data.description,
            data.amount,
            data.type,
            data.scope,
            data.category_id || null,
            data.source || null,
            data.status || 'confirmed',
            data.suggested_category_id || null,
            data.confidence_score || null,
            data.created_by,
            data.team || null,
            data.tax_rate || 0,
            data.tax_amount || 0,
            data.invoice_no || null,
            data.partner_name || null
        );
        return result.lastInsertRowid;
    },

    findById(id) {
        const stmt = db.prepare(`
      SELECT t.*, c.name as category_name, sc.name as suggested_category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN categories sc ON t.suggested_category_id = sc.id
      WHERE t.id = ?
    `);
        return stmt.get(id);
    },

    getAll(filters = {}) {
        let query = `
      SELECT t.*, c.name as category_name, sc.name as suggested_category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN categories sc ON t.suggested_category_id = sc.id
      WHERE 1=1
    `;
        const params = [];

        if (filters.applyTeamFilter) {
            if (filters.team) {
                query += ' AND t.team = ?';
                params.push(filters.team);
            } else {
                query += ' AND t.team IS NULL';
            }
        } else if (filters.team) {
            // Admin explicitly filtering by team
            query += ' AND t.team = ?';
            params.push(filters.team);
        }

        if (filters.type) {
            query += ' AND t.type = ?';
            params.push(filters.type);
        }
        if (filters.scope) {
            query += ' AND t.scope = ?';
            params.push(filters.scope);
        }
        if (filters.status) {
            if (Array.isArray(filters.status)) {
                query += ` AND t.status IN (${filters.status.map(() => '?').join(',')})`;
                params.push(...filters.status);
            } else {
                query += ' AND t.status = ?';
                params.push(filters.status);
            }
        }
        if (filters.category_id) {
            query += ' AND t.category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.start_date) {
            query += ' AND date(t.date) >= date(?)';
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ' AND date(t.date) <= date(?)';
            params.push(filters.end_date);
        }
        if (filters.search) {
            query += ' AND t.description LIKE ?';
            params.push(`%${filters.search}%`);
        }

        query += ' ORDER BY t.date DESC, t.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
            if (filters.offset) {
                query += ' OFFSET ?';
                params.push(parseInt(filters.offset));
            }
        }

        const stmt = db.prepare(query);
        return stmt.all(...params);
    },

    count(filters = {}) {
        let query = 'SELECT COUNT(*) as total FROM transactions t WHERE 1=1';
        const params = [];

        if (filters.applyTeamFilter) {
            if (filters.team) {
                query += ' AND t.team = ?';
                params.push(filters.team);
            } else {
                query += ' AND t.team IS NULL';
            }
        } else if (filters.team) {
            query += ' AND t.team = ?';
            params.push(filters.team);
        }

        if (filters.type) { query += ' AND t.type = ?'; params.push(filters.type); }
        if (filters.scope) { query += ' AND t.scope = ?'; params.push(filters.scope); }
        if (filters.status) {
            if (Array.isArray(filters.status)) {
                query += ` AND t.status IN (${filters.status.map(() => '?').join(',')})`;
                params.push(...filters.status);
            } else {
                query += ' AND t.status = ?'; params.push(filters.status);
            }
        }
        if (filters.category_id) { query += ' AND t.category_id = ?'; params.push(filters.category_id); }
        if (filters.start_date) { query += ' AND date(t.date) >= date(?)'; params.push(filters.start_date); }
        if (filters.end_date) { query += ' AND date(t.date) <= date(?)'; params.push(filters.end_date); }
        if (filters.search) { query += ' AND t.description LIKE ?'; params.push(`%${filters.search}%`); }

        const stmt = db.prepare(query);
        return stmt.get(...params).total;
    },

    update(id, data) {
        const fields = [];
        const params = [];

        if (data.date !== undefined) {
            fields.push('date = ?');
            params.push(data.date);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            params.push(data.description);
        }
        if (data.amount !== undefined) {
            fields.push('amount = ?');
            params.push(data.amount);
        }
        if (data.type !== undefined) {
            fields.push('type = ?');
            params.push(data.type);
        }
        if (data.scope !== undefined) {
            fields.push('scope = ?');
            params.push(data.scope);
        }
        if (data.category_id !== undefined) {
            fields.push('category_id = ?');
            params.push(data.category_id);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            params.push(data.status);
        }
        if (data.ai_explanation !== undefined) {
            fields.push('ai_explanation = ?');
            params.push(data.ai_explanation);
        }
        if (data.source !== undefined) {
            fields.push('source = ?');
            params.push(data.source);
        }
        if (data.tax_rate !== undefined) {
            fields.push('tax_rate = ?');
            params.push(data.tax_rate);
        }
        if (data.tax_amount !== undefined) {
            fields.push('tax_amount = ?');
            params.push(data.tax_amount);
        }
        if (data.invoice_no !== undefined) {
            fields.push('invoice_no = ?');
            params.push(data.invoice_no);
        }
        if (data.partner_name !== undefined) {
            fields.push('partner_name = ?');
            params.push(data.partner_name);
        }
        if (data.is_anomaly !== undefined) {
            fields.push('is_anomaly = ?');
            params.push(data.is_anomaly ? 1 : 0);
        }
        if (data.anomaly_note !== undefined) {
            fields.push('anomaly_note = ?');
            params.push(data.anomaly_note);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const stmt = db.prepare(
            `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`
        );
        return stmt.run(...params);
    },

    delete(id) {
        const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
        return stmt.run(id);
    },

    getStats(filters = {}) {
        let query = `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE status = 'confirmed'
    `;
        const params = [];

        if (filters.start_date) {
            query += ' AND date >= ?';
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ' AND date <= ?';
            params.push(filters.end_date);
        }
        if (filters.category_id) {
            query += ' AND category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.scope) {
            query += ' AND scope = ?';
            params.push(filters.scope);
        }
        if (filters.applyTeamFilter) {
            if (filters.team) {
                query += ' AND team = ?';
                params.push(filters.team);
            } else {
                query += ' AND team IS NULL';
            }
        } else if (filters.team) {
            query += ' AND team = ?';
            params.push(filters.team);
        }

        query += ' GROUP BY type';

        const stmt = db.prepare(query);
        const rows = stmt.all(...params);

        const result = {
            total_income: 0,
            total_expense: 0,
            count_income: 0,
            count_expense: 0
        };

        rows.forEach(row => {
            if (row.type === 'income') {
                result.total_income = row.total;
                result.count_income = row.count;
            } else if (row.type === 'expense') {
                result.total_expense = row.total;
                result.count_expense = row.count;
            }
        });

        return result;
    },

    getCategoryStats(filters = {}) {
        let query = `
      SELECT 
        c.id,
        c.name as category_name,
        t.type,
        t.scope,
        SUM(t.amount) as total,
        COUNT(*) as count,
        AVG(t.amount) as average,
        SQRT(AVG(t.amount * t.amount) - AVG(t.amount) * AVG(t.amount)) as std_dev
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.status = 'confirmed'
    `;
        const params = [];

        if (filters.start_date) {
            query += ' AND t.date >= ?';
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ' AND t.date <= ?';
            params.push(filters.end_date);
        }
        if (filters.category_id) {
            query += ' AND t.category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.scope) {
            query += ' AND t.scope = ?';
            params.push(filters.scope);
        }
        if (filters.applyTeamFilter) {
            if (filters.team) {
                query += ' AND t.team = ?';
                params.push(filters.team);
            } else {
                query += ' AND t.team IS NULL';
            }
        } else if (filters.team) {
            query += ' AND t.team = ?';
            params.push(filters.team);
        }

        query += ' GROUP BY c.id, c.name, t.type, t.scope';

        const stmt = db.prepare(query);
        return stmt.all(...params);
    }
});
