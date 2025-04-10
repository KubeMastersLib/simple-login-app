const express = require('express');
const router = express.Router();

// Hardcoded credentials (NOT recommended for production!)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        // User is logged in, proceed to the next middleware/route handler
        return next();
    }
    // User is not logged in, redirect to login page
    res.redirect('/login');
}

// GET /login - Display login page
router.get('/login', (req, res) => {
    // Pass error message from session if it exists (e.g., from failed login attempt)
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null; // Clear error message after displaying it
    res.render('login', { errorMessage }); // Render login.ejs
});

// POST /login - Handle login attempt
router.post('/login', (req, res) => {
    const { username, password } = req.body; // Get username/password from form data

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Authentication successful
        // Store user information in session
        req.session.user = { username: username };
        // Redirect to the dashboard
        res.redirect('/dashboard');
    } else {
        // Authentication failed
        // Store error message in session to display on login page
        req.session.errorMessage = 'Invalid username or password.';
        // Redirect back to login page
        res.redirect('/login');
    }
});

// GET /dashboard - Display dashboard page (protected)
// The isAuthenticated middleware runs first
router.get('/dashboard', isAuthenticated, (req, res) => {
    // If we reach here, isAuthenticated allowed it (user is logged in)
    res.render('dashboard', { username: req.session.user.username }); // Render dashboard.ejs
});

// GET /logout - Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.redirect('/dashboard'); // Or an error page
        }
        // Redirect to login page after session is destroyed
        res.redirect('/login');
    });
});

module.exports = router; // Export the router
