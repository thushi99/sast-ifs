export default function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Intentionally Vulnerable App</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                A playground for testing SAST tools and manual exploitation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                <div className="card">
                    <h3>SQL Injection</h3>
                    <p>Login page is vulnerable to basic string concatenation SQLi.</p>
                </div>
                <div className="card">
                    <h3>Command Injection</h3>
                    <p>Admin Pinger tool executes shell commands directly.</p>
                </div>
                <div className="card">
                    <h3>Business Logic Flaws</h3>
                    <p>Wallet transfers allow negative amounts and race conditions.</p>
                </div>
                <div className="card">
                    <h3>File Upload & Traversal</h3>
                    <p>Upload malicious scripts and read system files.</p>
                </div>
            </div>
        </div>
    )
}
