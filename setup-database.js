const mysql = require('mysql2/promise');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    try {
        // Connect to MySQL server (without database)
        let connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or already exists`);

        // Close connection and reconnect to the specific database
        await connection.end();
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log(`Connected to database ${process.env.DB_NAME}`);

        // Read and execute schema (skip CREATE DATABASE and USE statements)
        const schema = fs.readFileSync('./database/schema.sql', 'utf8');
        const statements = schema.split(';').filter(stmt => {
            const trimmed = stmt.trim();
            return trimmed && 
                   !trimmed.startsWith('CREATE DATABASE') && 
                   !trimmed.startsWith('USE');
        });

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    // Skip if table already exists or other non-critical errors
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
                await connection.execute(
                    'INSERT INTO categories (name, description) VALUES (?, ?)',
                    [name, description]
                );
            } catch (err) {
                // Category might already exist
                if (!err.message.includes('Duplicate entry')) {
                    throw err;
                }
            }
        }
        console.log('Sample categories inserted');

        // Insert sample products
        const products = [
            ['Smartphone', 'Latest smartphone with advanced features', 699.99, 50, 1, 'https://via.placeholder.com/280x200?text=Smartphone'],
            ['Laptop', 'High-performance laptop for work and gaming', 1299.99, 25, 1, 'https://via.placeholder.com/280x200?text=Laptop'],
            ['Wireless Headphones', 'Premium wireless headphones with noise cancellation', 199.99, 75, 1, 'https://via.placeholder.com/280x200?text=Headphones'],
            ['T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, 2, 'https://via.placeholder.com/280x200?text=T-Shirt'],
            ['Jeans', 'Classic blue jeans', 49.99, 75, 2, 'https://via.placeholder.com/280x200?text=Jeans'],
            ['Sneakers', 'Comfortable running sneakers', 89.99, 60, 2, 'https://via.placeholder.com/280x200?text=Sneakers'],
            ['JavaScript Guide', 'Complete guide to JavaScript programming', 29.99, 40, 3, 'https://via.placeholder.com/280x200?text=JS+Book'],
            ['Garden Tools Set', 'Complete set of gardening tools', 79.99, 30, 4, 'https://via.placeholder.com/280x200?text=Garden+Tools']
        ];

        for (const [name, description, price, stock, categoryId, imageUrl] of products) {
            try {
                await connection.execute(
                    'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                    [name, description, price, stock, categoryId, imageUrl]
                );
            } catch (err) {
                // Product might already exist
                if (!err.message.includes('Duplicate entry')) {
                    console.log(`Warning: Could not insert product ${name}:`, err.message);
                }
            }
        }
        console.log('Sample products inserted');

        // Create admin user
        const hashedPassword = await bcrypt.hash('password', 10);
        try {
            await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('Admin user created (email: admin@example.com, password: password)');
        } catch (err) {
            if (err.message.includes('Duplicate entry')) {
                console.log('Admin user already exists');
            } else {
                throw err;
            }
        }

        await connection.end();
        console.log('\n✅ Database setup completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Visit http://localhost:3000 for the store');
        console.log('2. Visit http://localhost:3000/admin for admin panel');
        console.log('3. Login as admin with: admin@example.com / password');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('\nPlease make sure:');
        console.log('1. MySQL is running');
        console.log('2. Your .env file has correct database credentials');
        console.log('3. The database user has CREATE privileges');
    }
}

setupDatabase();