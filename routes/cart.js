const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get cart items
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [cartItems] = await db.execute(`
            SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity,
                   (c.quantity * p.price) as total_price
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [req.user.userId]);
        
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to cart
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        
        // Check if product exists and has stock
        const [products] = await db.execute(
            'SELECT stock_quantity FROM products WHERE id = ?',
            [product_id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        if (products[0].stock_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        // Check if item already in cart
        const [existingItems] = await db.execute(
            'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.userId, product_id]
        );
        
        if (existingItems.length > 0) {
            // Update quantity
            const newQuantity = existingItems[0].quantity + quantity;
            await db.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, req.user.userId, product_id]
            );
        } else {
            // Add new item
            await db.execute(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.userId, product_id, quantity]
            );
        }
        
        res.json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update cart item quantity
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        
        if (quantity <= 0) {
            await db.execute(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [req.user.userId, product_id]
            );
        } else {
            await db.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.user.userId, product_id]
            );
        }
        
        res.json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
    try {
        await db.execute(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.userId, req.params.productId]
        );
        
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;