const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create category (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        
        res.status(201).json({ message: 'Category created', categoryId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;