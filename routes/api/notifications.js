const express = require('express');
const router = express.Router();

// Mock data for development
let notifications = [];

// Middleware to get user from session
const getUserFromSession = (req, res, next) => {
    req.user = req.session?.user || { id: 1, name: 'Test User', role: 'SUPER_ADMIN' }; // Mock user for testing
    next();
};

router.use(getUserFromSession);

// Get all notifications for current user
router.get('/', (req, res) => {
    const userNotifications = notifications.filter(n => n.userId === req.user.id);
    res.json(userNotifications);
});

// Mark notification as read
router.post('/:id/read', (req, res) => {
    const notificationId = parseInt(req.params.id);
    const notification = notifications.find(n => n.id === notificationId && n.userId === req.user.id);
    
    if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    res.json(notification);
});

// Add a new notification
router.post('/', (req, res) => {
    const { title, message, userId } = req.body;
    
    if (!title || !message || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification = {
        id: Date.now(),
        userId,
        title,
        message,
        timestamp: new Date(),
        read: false
    };

    notifications.push(notification);
    res.json(notification);
});

// Delete a notification
router.delete('/:id', (req, res) => {
    const notificationId = parseInt(req.params.id);
    const index = notifications.findIndex(n => n.id === notificationId && n.userId === req.user.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Notification not found' });
    }

    notifications.splice(index, 1);
    res.json({ success: true });
});

module.exports = router;
