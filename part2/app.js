const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_key_for_development',
    resave: false,
    // Don't save session if unmodified
    saveUninitialized: false,
    cookie: {
        // Use secure cookies in production
        secure: process.env.NODE_ENV === 'production',
        // If secure is true, the cookie will only be sent over HTTPS
        httpOnly: true,
        // Cookie will expire after 12 hours
        maxAge: 1000 * 60 * 60 * 12
    }
}))

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

// API routes
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Page routes
const authCheck = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

// Serve the owner dashboard page
app.get('/owner-dashboard', authCheck, (req, res) => {
    // Check if the user is an owner
    if (req.session.user.role === 'owner') {
        res.sendFile(path.join(__dirname, 'public', 'owner-dashboard.html'));
    } else {
        // If not an owner, deny access
        res.status(403).send('Acess denied');
    }
});

// Serve the walker dashboard page
app.get('/walker-dashboard', authCheck, (req, res) => {
    // Check if the user is a walker
    if (req.session.user.role === 'walker') {
        res.sendFile(path.join(__dirname, 'public', 'walker-dashboard.html'));
    }
    // If not a walker, deny access
    else {
        res.status(403).send('Access denied');
    }
});

app.get('/api/dogs', async (req, res) => {
    try {
        var get_dog_query = `
        SELECT
            d.name AS dog_name,
            d.size,
            u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id;
        `;
        var [rows] = await db.query(get_dog_query);
        res.json(rows);
    } catch (error) {
        console.error('Failed to get dogs list:', error);
        res.status(500).json({ error: 'Failed to get dogs list data' });
    }
});

// Export the app instead of listening here
module.exports = app;