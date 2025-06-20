const express = require('express');
const router = express.Router();
const db = require('../models/db');

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if email and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are not entered.' });
  }

  try {
    // Query to find user by email and password
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    // If no user found, return error
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Create a session for the user
    req.session.user = {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    };
    // Return success response with user data
    res.status(200).json({ message: 'Login successful', user: req.session.user });

  } catch (error) {
    // Log the error and return a generic error message
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET current user (if logged in)
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// GET dogs data for the logged in owner
router.get('/dogs', async (req, res) => {
  if (!req.se)
})

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Cannot log out' });
    }
    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;