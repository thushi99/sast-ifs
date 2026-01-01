const { pool } = require('../config/db');
const { hashPassword } = require('../utils/crypto');
const jwt = require('jsonwebtoken');

// VULNERABILITY: Hardcoded secret (SAST should detect)
const JWT_SECRET = 'supersecretkey123';

exports.register = async (req, res) => {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // VULNERABILITY: Weak Password Hashing (MD5)
    const hashedPassword = hashPassword(password);

    try {
        // This query is ACTUALLY parameterized (safe-ish), but the login will be vulnerable.
        // We mix styles to confuse SAST or show contrast.
        const query = 'INSERT INTO users (username, email, password, bio) VALUES ($1, $2, $3, $4) RETURNING id, username, email';
        const result = await pool.query(query, [username, email, hashedPassword, bio || '']);

        res.status(201).json({ message: 'User created', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // VULNERABILITY: SQL Injection
    // Directly concatenating user input into the query string
    const hashedPassword = hashPassword(password);

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashedPassword}'`;

    console.log(`Executing Query: ${query}`); // VULNERABILITY: Logging sensitive info (password hash in query)

    try {
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // VULNERABILITY: JWT with no expiration or very long expiration
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET // Missing expiresIn
            );

            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        // VULNERABILITY: Returning raw DB error (Information Disclosure)
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};
