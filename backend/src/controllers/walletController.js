const { pool } = require('../config/db');

// Helper sleep function to widen race condition window
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.getBalance = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
        res.json({ balance: result.rows[0].balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VULNERABILITY: Race Condition & Logic Error (Negative Transfer)
exports.transfer = async (req, res) => {
    const { recipientUsername, amount } = req.body;
    const senderId = req.user.id;

    // VULNERABILITY: Allowing negative amounts (Logic Flaw)
    // If amount is -100, we subtract -100 (add 100) to sender and add -100 (subtract 100) to recipient?
    // Usually logic flaws allow user to Increase their balance by sending negative money to someone else.
    // Let's assume standard logic: sender_balance -= amount, recipient_balance += amount.
    // If amount is -100: sender -= -100 (+100), recipient += -100 (-100). User steals money from recipient!
    // SAST often misses this unless it tracks Data Flow Semantics heavily.

    // NOTE: We are NOT checking if amount > 0 here.

    try {
        const recipientResult = await pool.query('SELECT id FROM users WHERE username = $1', [recipientUsername]);
        if (recipientResult.rows.length === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        const recipientId = recipientResult.rows[0].id;

        // VULNERABILITY: Race Condition
        // READ-MODIFY-WRITE operation without database transaction or locking.
        const senderWallet = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [senderId]);
        const currentBalance = parseFloat(senderWallet.rows[0].balance);

        if (currentBalance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Simulate processing delay to make race condition exploitable
        await sleep(1000);

        // Update Sender
        await pool.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [amount, senderId]);

        // Update Recipient
        await pool.query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [amount, recipientId]);

        res.json({ message: 'Transfer successful' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
