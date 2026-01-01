'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Direct call to backend
            const res = await axios.post('http://localhost:3001/api/auth/login', formData);
            Cookies.set('token', res.data.token);
            Cookies.set('user', JSON.stringify(res.data.user));
            // Force refresh to update Navbar state? In App Router we might need router.refresh() 
            // but simplistic approach:
            window.location.href = '/products';
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username (Try SQLi here)</label>
                        <input type="text" name="username" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Hint: try <code>' OR '1'='1</code>
                </p>
            </div>
        </div>
    );
}
