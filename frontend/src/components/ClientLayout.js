'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }) {
    const router = useRouter();
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Basic polling or event listener could improve this, but for now we rely on mount/update
        setToken(Cookies.get('token'));
    }, []); // Dependence on path changes? In App Router layouts don't always re-render. Ideally we use Context.
    // For simplicity, we'll keep it simple.

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setToken(null);
        router.push('/login');
    };

    return (
        <div className="container">
            <nav className="navbar">
                <Link href="/" className="navbar-brand">
                    Vulnerable<span style={{ color: 'var(--primary)' }}>App</span>
                </Link>
                <div className="nav-links">
                    <Link href="/">Home</Link>
                    {token ? (
                        <>
                            <Link href="/products">Shop</Link>
                            <Link href="/cart">Cart</Link>
                            <Link href="/my-orders">Orders</Link>
                            <Link href="/wallet">Wallet</Link>
                            <Link href="/files">Support</Link>
                            <Link href="/admin">Admin</Link>
                            <button onClick={logout} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
            <main>{children}</main>
            <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <p>⚠️ For Educational Purposes Only. Do NOT deploy to production.</p>
            </footer>
        </div>
    );
}
