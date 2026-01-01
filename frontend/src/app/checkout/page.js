'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setCart(JSON.parse(saved));
    }, []);

    const handleCheckout = async () => {
        try {
            const token = Cookies.get('token');
            const items = cart.map(i => ({ productId: i.id, quantity: i.quantity }));

            await axios.post('http://localhost:3001/api/orders',
                { items, couponCode: coupon },
                { headers: { Authorization: token } }
            );

            localStorage.removeItem('cart');
            router.push('/my-orders');
        } catch (err) {
            setMessage('Checkout failed: ' + (err.response?.data?.error || err.message));
        }
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <h1>Checkout</h1>
            <div className="card">
                <h3>Order Summary</h3>
                {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr style={{ borderColor: '#334155', margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <label>Coupon Code (Try 'SAVE10')</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    </div>
                </div>

                {message && <div style={{ color: 'var(--danger)', marginTop: '1rem' }}>{message}</div>}

                <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                    Pay with Wallet
                </button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8' }}>
                Tip: Try intercepting this request and sending negative quantities!
            </p>
        </div>
    );
}
