const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...\n');
    
    console.log('Environment Variables:');
    console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
    console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
    console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
    console.log('PORT:', process.env.PORT || 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
    console.log('\n');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Database connection successful!');
        
        // Check if tables exist
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`\nFound ${tables.length} tables:`);
        tables.forEach(table => {
            console.log('-', Object.values(table)[0]);
        });

        // Check products count
        try {
            const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
            console.log(`\n✅ Products in database: ${products[0].count}`);
        } catch (err) {
            console.log('\n⚠️ Products table not found or empty');
        }

        // Check users count
        try {
            const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
            console.log(`✅ Users in database: ${users[0].count}`);
        } catch (err) {
            console.log('⚠️ Users table not found or empty');
        }

        await connection.end();
        console.log('\n✅ All checks completed!');
        
    } catch (error) {
        console.error('\n❌ Database connection failed!');
        console.error('Error:', error.message);
        console.error('\nPlease check:');
        console.error('1. MySQL database is created and running');
        console.error('2. Environment variables are correct');
        console.error('3. Database host is accessible from your service');
    }
}

testConnection();