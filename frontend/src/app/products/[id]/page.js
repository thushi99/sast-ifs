'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [review, setReview] = useState('');
    const params = useParams();
    const id = params.id;

    const token = Cookies.get('token');

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3001/api/products/${id}/reviews`, { content: review }, {
                headers: { Authorization: token }
            });
            fetchProduct();
            setReview('');
        } catch (err) {
            alert('Failed to post review');
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <img src={product.image_url} alt={product.name} style={{ width: '400px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                    <h1>{product.name}</h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b' }}>{product.description}</p>
                    <h2 style={{ color: 'var(--primary)' }}>${product.price}</h2>
                    <button onClick={addToCart} className="btn btn-primary" style={{ marginTop: '1rem' }}>Add to Cart</button>
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h3>Reviews <span className="vuln-badge">Stored XSS</span></h3>
                <div style={{ marginBottom: '2rem' }}>
                    {product.reviews && product.reviews.map((r, i) => (
                        <div key={i} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                            <small style={{ color: '#94a3b8' }}>{r.username}</small>
                            <div dangerouslySetInnerHTML={{ __html: r.content }} />
                        </div>
                    ))}
                </div>

                {token && (
                    <form onSubmit={submitReview} className="card">
                        <h4>Write a Review</h4>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="This product is <b>amazing</b>!"
                            rows="3"
                            required
                        ></textarea>
                        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
}
