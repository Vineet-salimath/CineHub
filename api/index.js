require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── DATABASE ──────────────────────────────────────────────────────────────────
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Ensure users table exists
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('DB init error:', err.message));

// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.decode(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CineHub API running on Vercel' });
});

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { userId, username, email, phone, password, confirmPassword } = req.body;

    if (!userId || !username || !email || !phone || !password || !confirmPassword)
      return res.status(400).json({ error: 'All fields are required' });

    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    if (!email.includes('@'))
      return res.status(400).json({ error: 'Invalid email format' });

    const existing = await pool.query(
      'SELECT 1 FROM users WHERE username = $1 OR email = $2 OR user_id = $3',
      [username, email, userId]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, username, email',
      [userId, username, email, phone, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.encode(
      { id: user.id, userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user.id, userId: user.user_id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR user_id = $1',
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.encode(
      { id: user.id, userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, userId: user.user_id, username: user.username, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ── PROFILE ───────────────────────────────────────────────────────────────────
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id, userId: user.user_id, username: user.username,
        email: user.email, phone: user.phone, createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Export for Vercel serverless
module.exports = app;
