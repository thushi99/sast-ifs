'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = Cookies.get('token');
            const res = await axios.get('http://localhost:3001/api/orders/my-orders', {
                headers: { Authorization: token }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>My Orders</h1>
            <div className="card">
                {orders.length === 0 ? <p>No orders found.</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #475569' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>Date</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '0.5rem' }}>#{order.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.5rem' }}>${order.total}</td>
                                    <td style={{ padding: '0.5rem' }}>{order.status}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <Link href={`/orders/${order.id}`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>View Receipt</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
