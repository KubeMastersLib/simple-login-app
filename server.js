const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Import the authentication routes

const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000

// --- Middleware Configuration ---

// 1. View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Tell Express where to find EJS files

// 2. Body Parser Middleware (to handle form data)
// Parses URL-encoded bodies (like form submissions)
app.use(express.urlencoded({ extended: false }));
// Parses JSON bodies (useful for APIs, not strictly needed for this form example)
app.use(express.json());

// 3. Static Files Middleware (Optional but good practice)
// Serve static files (CSS, images, client-side JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// 4. Session Middleware
app.use(session({
    secret: 'your_very_secret_key_change_this!', // IMPORTANT: Change this to a long random string! Keep it secret.
    resave: false,                 // Don't save session if unmodified
    saveUninitialized: false,      // Don't create session until something stored
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 // Cookie expiry time (e.g., 1 hour)
    }
}));

// --- Routes ---

// Mount the authentication routes
app.use('/', authRoutes);

// Basic root route - redirect to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Optional: Handle 404 Not Found for any other route
app.use((req, res) => {
    res.status(404).send("Sorry, page not found!");
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
