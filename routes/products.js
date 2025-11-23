const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and search
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, sort = 'created_at', order = 'DESC' } = req.query;
        
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
        `;
        const params = [];
        
        if (category) {
            query += ' AND p.category_id = ?';
            params.push(category);
        }
        
        if (minPrice) {
            query += ' AND p.price >= ?';
            params.push(minPrice);
        }
        
        if (maxPrice) {
            query += ' AND p.price <= ?';
            params.push(maxPrice);
        }
        
        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ` ORDER BY p.${sort} ${order}`;
        
        const [products] = await db.execute(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.execute(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
            [req.params.id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, image_url } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, category_id, image_url]
        );
        
        res.status(201).json({ message: 'Product created', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, image_url } = req.body;
        
        await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ? WHERE id = ?',
            [name, description, price, stock_quantity, category_id, image_url, req.params.id]
        );
        
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get categories
router.get('/categories/all', async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;