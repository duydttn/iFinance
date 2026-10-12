const stmtCache = new Map();

module.exports = (db) => ({
    classifyTransaction(description, scope) {
        const descriptionLower = description.toLowerCase();

        // Cache statement for primary rule match
        if (!this.ruleStmt) {
            this.ruleStmt = db.prepare(`
                SELECT r.category_id, c.name, r.priority
                FROM rules r
                JOIN categories c ON r.category_id = c.id
                WHERE (r.scope = ? OR r.scope = 'both')
                  AND LOWER(?) LIKE '%' || LOWER(r.keyword) || '%'
                ORDER BY r.priority DESC, LENGTH(r.keyword) DESC
                LIMIT 1
            `);
        }

        const match = this.ruleStmt.get(scope, description);

        if (match) {
            return {
                category_id: match.category_id,
                category_name: match.name,
                confidence: 0.9
            };
        }

        const words = description.split(/\s+/).filter(w => w.length > 3).slice(0, 5);
        let bestMatch = null;

        if (words.length > 0) {
            // P-05 fix: Cache prepared statements by word count to prevent statement cache explosion
            const cacheKey = words.length;
            if (!stmtCache.has(cacheKey)) {
                const conditions = words.map(() => "LOWER(t.description) LIKE '%' || LOWER(?) || '%'").join(' OR ');
                stmtCache.set(cacheKey, db.prepare(`
                    SELECT t.category_id, c.name, COUNT(*) as frequency
                    FROM transactions t
                    JOIN categories c ON t.category_id = c.id
                    WHERE t.scope = ? AND t.status = 'confirmed' AND t.category_id IS NOT NULL
                      AND (${conditions})
                    GROUP BY t.category_id
                    ORDER BY frequency DESC
                    LIMIT 1
                `));
            }
            
            const batchStmt = stmtCache.get(cacheKey);
            const result = batchStmt.get(scope, ...words);
            if (result) bestMatch = result;
        }

        if (bestMatch) {
            return {
                category_id: bestMatch.category_id,
                category_name: bestMatch.name,
                confidence: Math.min(0.7, 0.5 + (bestMatch.frequency * 0.05))
            };
        }

        return {
            category_id: null,
            category_name: null,
            confidence: 0
        };
    },

    shouldSuggest(confidence) {
        return confidence >= 0.6;
    }
});
