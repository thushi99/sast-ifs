const path = require('path');
const fs = require('fs');

// VULNERABILITY: Unrestricted File Upload
exports.uploadFile = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFile = req.files.file;

    // VULNERABILITY: No check on file extension or MIME type.
    // Attackers can upload .php, .js, .html files.
    // Also using user-supplied filename directly.
    const uploadPath = path.join(__dirname, '../../uploads/', uploadedFile.name);

    // Create uploads dir if not exists
    if (!fs.existsSync(path.join(__dirname, '../../uploads/'))) {
        fs.mkdirSync(path.join(__dirname, '../../uploads/'), { recursive: true });
    }

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({ message: 'File uploaded!', path: `/uploads/${uploadedFile.name}` });
    });
};

// VULNERABILITY: Path Traversal
exports.viewFile = (req, res) => {
    const filename = req.query.name;

    // VULNERABILITY: Allowing "../" in filename
    const filePath = path.join(__dirname, '../../uploads/', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: 'File not found or access denied' });
        }
        res.send(data);
    });
};
