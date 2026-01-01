'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Wallet() {
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(Cookies.get('token'));
    }, []);

    const fetchBalance = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/wallet/balance', {
                headers: { Authorization: token }
            });
            setBalance(res.data.balance);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchBalance();
    }, [token]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await axios.post(
                'http://localhost:3001/api/wallet/transfer',
                { recipientUsername: recipient, amount: parseFloat(amount) },
                { headers: { Authorization: token } }
            );
            setMessage('Transfer successful!');
            fetchBalance();
        } catch (err) {
            setError(err.response?.data?.error || 'Transfer failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <h1>My Wallet</h1>
            <div className="card" style={{ borderColor: 'var(--primary)' }}>
                <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>${balance}</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Current Balance</p>
            </div>

            <div className="card">
                <h3>Transfer Funds <span className="vuln-badge">Business Logic / Race Condition</span></h3>
                {message && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{message}</div>}
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="form-group">
                        <label>Recipient Username</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount (Try negative values!)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Send Money</button>
                </form>
            </div>
        </div>
    );
}
