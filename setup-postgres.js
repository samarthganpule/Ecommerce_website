const { Client } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    try {
        // Connect to PostgreSQL database
        const connection = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });

        await connection.connect();
        console.log('Connected to PostgreSQL database');

        // Read and execute schema
        const schema = fs.readFileSync('./database/schema.sql', 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                } catch (err) {
                    if (!err.message.includes('already exists')) {
                        console.log(`Warning: ${err.message}`);
                    }
                }
            }
        }
        console.log('Database schema created successfully');

        // Insert sample categories
        const categories = [
            ['Electronics', 'Electronic devices and gadgets'],
            ['Clothing', 'Fashion and apparel'],
            ['Books', 'Books and literature'],
            ['Home & Garden', 'Home improvement and gardening']
        ];

        for (const [name, description] of categories) {
            try {
                await connection.query(
                    'INSERT INTO categories (name, description) VALUES ($1, $2)',
                    [name, description]
                );
            } catch (err) {
                if (!err.message.includes('duplicate key')) {
                    throw err;
                }
            }
        }
        console.log('Sample categories inserted');

        // Create admin user
        const hashedPassword = await bcrypt.hash('password', 10);
        try {
            await connection.query(
                'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
                ['admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('Admin user created (email: admin@example.com, password: password)');
        } catch (err) {
            if (err.message.includes('duplicate key')) {
                console.log('Admin user already exists');
            } else {
                throw err;
            }
        }

        await connection.end();
        console.log('\n✅ Database setup completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Visit your website to see it working');
        console.log('2. Run: npm run setup-products (to add 52 products)');
        console.log('3. Login as admin with: admin@example.com / password');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('\nPlease make sure:');
        console.log('1. PostgreSQL database is created and running');
        console.log('2. Your environment variables are correct');
        console.log('3. Database host is accessible from your service');
    }
}

setupDatabase();