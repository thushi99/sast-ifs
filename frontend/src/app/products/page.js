'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Products() {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get('q'); // Vulnerable parameter

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value;
        router.push(`/products?q=${searchTerm}`);
    }

    const filteredProducts = q
        ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
        : products;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>Product Catalog</h1>

            {/* VULNERABILITY: Reflected XSS */}
            {q && (
                <div className="alert-info" style={{ marginBottom: '1rem', padding: '1rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px' }}>
                    Search results for: <span dangerouslySetInnerHTML={{ __html: q }} />
                </div>
            )}

            <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
                <input name="search" type="text" placeholder="Search products..." style={{ width: '300px', display: 'inline-block', marginRight: '1rem' }} />
                <button className="btn btn-primary">Search</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                {filteredProducts.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>${p.price}</span>
                            <Link href={`/products/${p.id}`} className="btn btn-primary">View</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
