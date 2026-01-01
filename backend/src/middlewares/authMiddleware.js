const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey123'; // Hardcoded again

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // VULNERABILITY: Weak Token Validation & potentially accepting "None" algorithm if older JWT lib or misconfigured (though jwt.verify usually handles this, we simplify for demo)
    // Also simply splitting without checking "Bearer" prefix strictly
    const token = authHeader.split(' ')[1] || authHeader;

    try {
        // VULNERABILITY: Not checking for specific algorithms (SAST might flag missing algorithms parameter)
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
