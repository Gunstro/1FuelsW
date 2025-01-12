const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:", "tile.openstreetmap.org"],
            connectSrc: ["'self'", "wss:", "ws:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
            childSrc: ["'self'", "blob:"],
            workerSrc: ["'self'", "blob:"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Auth middleware
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Messages and notifications API
app.use('/api/messages', authMiddleware, require('./routes/api/messages'));
app.use('/api/notifications', authMiddleware, require('./routes/api/notifications'));

// Tanks API
app.use('/api/tanks', authMiddleware, require('./routes/api/tanks'));

// Sites API
app.use('/api/sites', authMiddleware, require('./routes/api/sites'));

// Vehicles API
app.use('/api/vehicles', authMiddleware, require('./routes/api/vehicles'));

// Pages API
app.use('/api/pages', authMiddleware, require('./routes/pages'));

// Basic page routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/resellers', (req, res) => {
    if (req.session.user && req.session.user.role === 'SUPER_ADMIN') {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/allclients', (req, res) => {
    if (req.session.user && req.session.user.role === 'SUPER_ADMIN') {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/clients', (req, res) => {
    if (req.session.user && req.session.user.role === 'SELLER_ADMIN') {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Import routes
const pagesRouter = require('./routes/pages');
const messagesRouter = require('./routes/api/messages');
const sitesRouter = require('./routes/api/sites');
const vehiclesRouter = require('./routes/api/vehicles');
const usersRouter = require('./routes/users');
const fuelRouter = require('./routes/fuel');

// Protected API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/fuel', fuelRouter);

// Use routes
app.use('/', pagesRouter);
app.use('/api/sites', sitesRouter);
app.use('/api/vehicles', vehiclesRouter);

// Page routes with auth check
app.use('/api/pages', (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}, require('./routes/pages'));

// Serve favicon and icons
app.use('/icons', express.static(path.join(__dirname, 'public', 'icons')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'icons', 'favicon.ico')));

// PWA Service Worker
app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'service-worker.js'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
