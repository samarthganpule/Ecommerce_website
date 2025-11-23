const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/create', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { shipping_address } = req.body;
        
        // Get cart items
        const [cartItems] = await connection.execute(`
            SELECT c.product_id, c.quantity, p.price, p.stock_quantity
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [req.user.userId]);
        
        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        // Calculate total and check stock
        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
            }
            totalAmount += item.price * item.quantity;
        }
        
        // Create order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
            [req.user.userId, totalAmount, shipping_address]
        );
        
        const orderId = orderResult.insertId;
        
        // Create order items and update stock
        for (const item of cartItems) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            await connection.execute(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }
        
        // Clear cart
        await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);
        
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId,
            totalAmount 
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Server error' });
    } finally {
        connection.release();
    }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const [orders] = await db.execute(`
            SELECT o.*, 
                   GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ') as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.userId]);
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get order details
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const [orderItems] = await db.execute(`
            SELECT oi.*, p.name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [req.params.id]);
        
        res.json({
            order: orders[0],
            items: orderItems
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all orders (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [orders] = await db.execute(`
            SELECT o.*, u.username
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;