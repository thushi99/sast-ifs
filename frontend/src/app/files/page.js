'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Files() {
    const [file, setFile] = useState(null);
    const [uploadPath, setUploadPath] = useState('');
    const [viewFile, setViewFile] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:3001/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadPath(res.data.path);
            setError('');
        } catch (err) {
            setError('Upload failed');
        }
    };

    const handleView = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:3001/api/files/view?name=${viewFile}`);
            setFileContent(res.data);
        } catch (err) {
            setFileContent('Error reading file');
        }
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1>File Manager</h1>

            <div className="card">
                <h3>Upload File <span className="vuln-badge">Unrestricted Upload</span></h3>
                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" onChange={handleFileChange} />
                    </div>
                    <button className="btn btn-primary">Upload</button>
                </form>
                {uploadPath && (
                    <div style={{ marginTop: '1rem', color: 'var(--success)' }}>
                        File uploaded to: <code>{uploadPath}</code>
                    </div>
                )}
            </div>

            <div className="card">
                <h3>View File <span className="vuln-badge">Path Traversal</span></h3>
                <p>Try reading <code>../package.json</code> or <code>../../.env</code> (simulated)</p>
                <form onSubmit={handleView} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="filename.txt"
                        value={viewFile}
                        onChange={(e) => setViewFile(e.target.value)}
                    />
                    <button className="btn btn-primary">Read</button>
                </form>
                {fileContent && (
                    <pre style={{
                        background: '#000',
                        padding: '1rem',
                        borderRadius: '4px',
                        overflowX: 'auto',
                        marginTop: '1rem'
                    }}>
                        {typeof fileContent === 'object' ? JSON.stringify(fileContent, null, 2) : fileContent}
                    </pre>
                )}
            </div>
        </div>
    );
}
