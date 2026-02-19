require('dotenv').config();
const { Pool } = require('pg');

// Allow self-signed certs for Aiven cloud database
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL environment variable is not set!');
  console.error('Please add DATABASE_URL to your .env or Railway variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✓ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
  console.error('Details:', err);
});

// Create users table if it doesn't exist
const initializeDB = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          user_id TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Users table ready');
      return;
    } catch (error) {
      retries--;
      console.error(`DB init error (attempt ${4-retries}/3):`, error.message);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
};

initializeDB();

module.exports = pool;
