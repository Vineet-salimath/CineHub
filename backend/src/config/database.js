require('dotenv').config();
const { Pool } = require('pg');

// Allow self-signed certs for Aiven cloud database
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Log connection info for debugging
console.log('Attempting to connect to PostgreSQL...');
console.log('Host:', process.env.DB_HOST || 'from DATABASE_URL');
console.log('Port:', process.env.DB_PORT || '25673');
console.log('Database:', process.env.DB_NAME || 'defaultdb');

const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || 'pg-4b8d63d-cinehub.b.aivencloud.com',
      port: parseInt(process.env.DB_PORT || '25673'),
      database: process.env.DB_NAME || 'defaultdb',
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD || '',
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✓ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
  console.error('Error code:', err.code);
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
