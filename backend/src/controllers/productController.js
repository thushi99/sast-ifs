const { pool } = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        // VULNERABILITY: Stored XSS
        // We fetch reviews and send them to frontend. Frontend renders them RAW.
        const reviews = await pool.query(`
            SELECT r.*, u.username 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = $1
        `, [id]);

        res.json({ ...product.rows[0], reviews: reviews.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ error: 'Content required' });

    try {
        // VULNERABILITY: Stored XSS - Inserting content directly without sanitization (though DB usually handles sql injection via params, the CONTENT is malicious HTML)
        await pool.query(
            'INSERT INTO reviews (product_id, user_id, content, rating) VALUES ($1, $2, $3, $4)',
            [id, userId, content, rating || 5]
        );
        res.status(201).json({ message: 'Review added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
