const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Wrapper to make it compatible with MySQL2 syntax
const promisePool = {
    async execute(query, params = []) {
        const client = await pool.connect();
        try {
            // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
            let pgQuery = query;
            let paramIndex = 1;
            while (pgQuery.includes('?')) {
                pgQuery = pgQuery.replace('?', `$${paramIndex}`);
                paramIndex++;
            }
            
            const result = await client.query(pgQuery, params);
            return [result.rows, result.fields];
        } finally {
            client.release();
        }
    },
    
    async getConnection() {
        const client = await pool.connect();
        return {
            async execute(query, params = []) {
                let pgQuery = query;
                let paramIndex = 1;
                while (pgQuery.includes('?')) {
                    pgQuery = pgQuery.replace('?', `$${paramIndex}`);
                    paramIndex++;
                }
                const result = await client.query(pgQuery, params);
                return [result.rows, result.fields];
            },
            async beginTransaction() {
                await client.query('BEGIN');
            },
            async commit() {
                await client.query('COMMIT');
            },
            async rollback() {
                await client.query('ROLLBACK');
            },
            release() {
                client.release();
            },
            end() {
                client.release();
            }
        };
    }
};

module.exports = promisePool;