'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setCart(JSON.parse(saved));
    }, []);

    const updateQuantity = (id, delta) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + delta };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>Shopping Cart</h1>
            {cart.length === 0 ? <p>Cart is empty</p> : (
                <>
                    <div className="card">
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', padding: '1rem 0' }}>
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button onClick={() => updateQuantity(item.id, -1)} className="btn">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="btn">+</button>
                                    <button onClick={() => removeItem(item.id)} className="btn btn-danger">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <h2>Total: ${total.toFixed(2)}</h2>
                        <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                    </div>
                </>
            )}
        </div>
    );
}
