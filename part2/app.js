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
        maxAge: 1000 * 60 * 60 *12
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



// Export the app instead of listening here
module.exports = app;