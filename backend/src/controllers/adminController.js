const { exec } = require('child_process');

// VULNERABILITY: Command Injection
exports.ping = (req, res) => {
    const { host } = req.body;

    if (!host) {
        return res.status(400).json({ error: 'Host is required' });
    }

    // VULNERABILITY: Putting user input directly into shell command
    // Exploit: 127.0.0.1; cat /etc/passwd
    exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message, stderr });
        }
        res.json({ output: stdout });
    });
};

// VULNERABILITY: Broken Access Control (No check if actually admin, relies on frontend or route struct)
// Assuming route is protected but maybe not checking 'role' in middleware heavily
exports.getAllUsers = (req, res) => {
    // This function would grab all users.
    // In a real vulnerability, we might lack the 'checkRole' middleware on the route.
    res.json({ message: "Admin access granted", sensitiveData: "Root access enabled" });
};
