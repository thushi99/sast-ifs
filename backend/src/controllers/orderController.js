const { pool } = require('../config/db');

exports.createOrder = async (req, res) => {
    const userId = req.user.id;
    const { items, couponCode } = req.body;
    // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in cart' });
    }

    try {
        let total = 0;

        // Calculate Total
        for (let item of items) {
            const productRes = await pool.query('SELECT price FROM products WHERE id = $1', [item.productId]);
            if (productRes.rows.length > 0) {
                const price = parseFloat(productRes.rows[0].price);
                // VULNERABILITY: Logic Flaw - Allowing negative quantity
                // If quantity is -5, total decreases.
                total += price * item.quantity;
            }
        }

        // Apply Coupon (Simple Logic)
        if (couponCode) {
            const couponRes = await pool.query('SELECT discount FROM coupons WHERE code = $1', [couponCode]);
            if (couponRes.rows.length > 0) {
                // VULNERABILITY: Coupon Reuse / Logic
                // We don't check if user already used it.
                // We don't mark it as used (or maybe we do but not atomically).
                total -= parseFloat(couponRes.rows[0].discount);
            }
        }

        // VULNERABILITY: Not checking if total < 0
        // If total is negative, user GETS money? (Or just pays 0 depending on payment gateway, but here we just deduct from wallet)

        // Deduct from Wallet (Race Condition potential here too but focusing on WalletController for that)
        await pool.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [total, userId]);

        // Create Order
        const orderRes = await pool.query(
            'INSERT INTO orders (user_id, total, items, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, total, JSON.stringify(items), 'completed']
        );

        res.status(201).json({ message: 'Order created', orderId: orderRes.rows[0].id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    // VULNERABILITY: IDOR
    // No check if order belongs to req.user.id
    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

        res.json(order.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(orders.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
