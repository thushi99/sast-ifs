'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const token = Cookies.get('token');
            const res = await axios.get(`http://localhost:3001/api/orders/${id}`, {
                headers: { Authorization: token }
            });
            setOrder(res.data);
        } catch (err) {
            setError('Failed to load order. It might not exist.');
        }
    };

    if (error) return <div className="container" style={{ marginTop: '2rem', color: 'var(--danger)' }}>{error}</div>;
    if (!order) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <h1>Order Receipt <span className="vuln-badge">IDOR</span></h1>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Order #{order.id}</h3>
                    <span style={{ color: '#94a3b8' }}>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>User ID:</strong> {order.user_id} (If this isn't you, it's IDOR!)</p>

                <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                    <h4>Items</h4>
                    {order.items && order.items.map((item, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem' }}>
                            Produto ID {item.productId}: Qty {item.quantity}
                        </div>
                    ))}
                </div>

                <h2 style={{ textAlign: 'right', marginTop: '1rem' }}>Total: ${order.total}</h2>
            </div>
        </div>
    );
}
