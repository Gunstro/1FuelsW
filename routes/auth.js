const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts, please try again later'
});

router.post('/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            error: 'Email and password are required' 
        });
    }

    try {
        // Get user from database
        const [rows] = await pool.execute(
            'SELECT id, email, password, role, name FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = rows[0];

        // Compare hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set session data
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        // Return user data without password
        const { password: _, ...userData } = user;
        
        res.json({
            success: true,
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/check', async (req, res) => {
    // Check session first
    if (req.session.user) {
        return res.json({
            authenticated: true,
            user: req.session.user
        });
    }

    // Fallback to token check
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            authenticated: false 
        });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get fresh user data from database
        const [rows] = await pool.execute(
            'SELECT id, email, role, name FROM users WHERE id = ?',
            [decoded.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                authenticated: false 
            });
        }

        res.json({
            authenticated: true,
            user: rows[0]
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ 
            authenticated: false 
        });
    }
});

// Middleware to check user role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    };
};

module.exports = router;
