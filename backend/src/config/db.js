const { Pool } = require('pg');

// VULNERABILITY: Hardcoded credentials (SAST should detect this if used directly, here we use process.env but have a fallback)
const dbConfig = {
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vuln_db',
  password: process.env.DB_PASSWORD || 'secretpassword', // Hardcoded secret
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
