const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const client = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation helper
const validateInput = (username, email, password) => {
  if (!username || !email || !password) {
    return 'Missing required fields';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!email.includes('@')) {
    return 'Invalid email format';
  }
  return null;
};

// REGISTER ENDPOINT
router.post('/register', async (req, res) => {
  try {
    const { userId, username, email, phone, password, confirmPassword } = req.body;

    // Validate all fields
    if (!userId || !username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const validationError = validateInput(username, email, password);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if user exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2 OR user_id = $3',
      [username, email, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await client.query(
      'INSERT INTO users (user_id, username, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, username, email',
      [userId, username, email, phone, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.encode(
      { id: user.id, userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error - Full Details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error during registration', details: error.message });
  }
});

// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user by username or user_id
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 OR user_id = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.encode(
      { id: user.id, userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error - Full Details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error during login', details: error.message });
  }
});

// PROFILE ENDPOINT
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        userId: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile error - Full Details:', error);
    console.error('Error message:', error.message);
    res.status(500).json({ error: 'Server error fetching profile', details: error.message });
  }
});

module.exports = router;
