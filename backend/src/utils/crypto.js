const crypto = require('crypto');

// VULNERABILITY: Weak Cryptography (MD5)
// SAST should detect use of weak hashing algorithm
const hashPassword = (password) => {
    return crypto.createHash('md5').update(password).digest('hex');
};

module.exports = {
    hashPassword,
};
