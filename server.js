const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Test database connection endpoint
app.get('/api/test-connection', async (req, res) => {
    try {
        const db = require('./config/database');
        const [result] = await db.execute('SELECT COUNT(*) as count FROM products');
        res.json({
            success: true,
            message: 'Database connected!',
            productCount: result[0].count,
            env: {
                DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
                DB_PORT: process.env.DB_PORT || 'NOT SET',
                DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
                DB_NAME: process.env.DB_NAME || 'NOT SET'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            env: {
                DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
                DB_PORT: process.env.DB_PORT || 'NOT SET',
                DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
                DB_NAME: process.env.DB_NAME || 'NOT SET'
            }
        });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});