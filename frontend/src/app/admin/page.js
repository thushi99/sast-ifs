'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Admin() {
    const [host, setHost] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handlePing = async (e) => {
        e.preventDefault();
        setOutput('');
        setError('');

        try {
            const token = Cookies.get('token');
            const res = await axios.post(
                'http://localhost:3001/api/admin/ping',
                { host },
                { headers: { Authorization: token } }
            );
            setOutput(res.data.output);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            if (err.response?.data?.stderr) {
                setOutput(err.response.data.stderr);
            }
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
            <h1>Admin Tools <span className="vuln-badge">Command Injection</span></h1>
            <div className="card">
                <h3>Network Diagnostics</h3>
                <form onSubmit={handlePing}>
                    <div className="form-group">
                        <label>Ping Host</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                placeholder="127.0.0.1"
                                required
                            />
                            <button className="btn btn-primary" type="submit">Ping</button>
                        </div>
                    </div>
                </form>

                {output && (
                    <div style={{ marginTop: '1rem' }}>
                        <label>Output:</label>
                        <pre style={{
                            background: '#000',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflowX: 'auto',
                            fontFamily: 'monospace'
                        }}>
                            {output}
                        </pre>
                    </div>
                )}
                {error && (
                    <div style={{ marginTop: '1rem', color: 'var(--danger)' }}>
                        Error: {error}
                    </div>
                )}
            </div>
        </div>
    );
}
