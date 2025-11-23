const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...\n');
    
    console.log('Environment Variables:');
    console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
    console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
    console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
    console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
    console.log('PORT:', process.env.PORT || 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
    console.log('\n');

    try {
        const connection = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            ssl: {
                rejectUnauthorized: false
            }
        });

        await connection.connect();
        console.log('✅ Database connection successful!');
        
        // Check if tables exist
        const tables = await connection.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log(`\nFound ${tables.rows.length} tables:`);
        tables.rows.forEach(table => {
            console.log('-', table.table_name);
        });

        // Check products count
        try {
            const products = await connection.query('SELECT COUNT(*) as count FROM products');
            console.log(`\n✅ Products in database: ${products.rows[0].count}`);
        } catch (err) {
            console.log('\n⚠️ Products table not found or empty');
        }

        // Check users count
        try {
            const users = await connection.query('SELECT COUNT(*) as count FROM users');
            console.log(`✅ Users in database: ${users.rows[0].count}`);
        } catch (err) {
            console.log('⚠️ Users table not found or empty');
        }

        // Check categories count
        try {
            const categories = await connection.query('SELECT COUNT(*) as count FROM categories');
            console.log(`✅ Categories in database: ${categories.rows[0].count}`);
        } catch (err) {
            console.log('⚠️ Categories table not found or empty');
        }

        await connection.end();
        console.log('\n✅ All checks completed!');
        
    } catch (error) {
        console.error('\n❌ Database connection failed!');
        console.error('Error:', error.message);
        console.error('\nPlease check:');
        console.error('1. PostgreSQL database is created and running');
        console.error('2. Environment variables are correct');
        console.error('3. Database host is accessible');
        console.error('4. SSL is enabled (Aiven requires SSL)');
    }
}

testConnection();