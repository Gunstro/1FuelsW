const express = require('express');
const router = express.Router();

// Mock data for development
let messages = [
    { id: 1, senderId: 1, recipientId: 2, content: 'Hello Jane!', timestamp: new Date(), unread: true },
    { id: 2, senderId: 2, recipientId: 1, content: 'Hi John, how are you?', timestamp: new Date(), unread: true }
];
let notifications = [];
let users = [
    { id: 1, name: 'John Doe', role: 'SUPER_ADMIN' },
    { id: 2, name: 'Jane Smith', role: 'SELLER_ADMIN' },
    { id: 3, name: 'Bob Johnson', role: 'CLIENT_ADMIN' }
];

// Middleware to get user from session
const getUserFromSession = (req, res, next) => {
    req.user = req.session?.user || { id: 1, name: 'Test User', role: 'SUPER_ADMIN' }; // Mock user for testing
    next();
};

router.use(getUserFromSession);

// Get all messages for current user
router.get('/messages', (req, res) => {
    const userMessages = messages.filter(m => 
        m.recipientId === req.user.id || m.senderId === req.user.id
    );
    res.json(userMessages);
});

// Send a new message
router.post('/messages/send', (req, res) => {
    try {
        const { recipientId, subject, content } = req.body;
        
        if (!recipientId || !subject || !content) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        const message = {
            id: Date.now(),
            senderId: req.user.id,
            sender: req.user.name,
            recipientId: parseInt(recipientId),
            subject,
            content,
            preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            timestamp: new Date(),
            unread: true
        };
        
        messages.unshift(message);
        
        // Add notification for recipient
        addNotification(
            message.recipientId,
            'New Message',
            `You have a new message from ${req.user.name}`
        );

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message' 
        });
    }
});

// Mark message as read
router.post('/messages/read/:id', (req, res) => {
    const message = messages.find(m => m.id === parseInt(req.params.id));
    if (message) {
        message.unread = false;
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Message not found' });
    }
});

// Clear all notifications for current user
router.post('/notifications/clear', (req, res) => {
    notifications = notifications.filter(n => n.userId !== req.user.id);
    res.json({ success: true });
});

// Get list of users for messaging
router.get('/users/list', (req, res) => {
    res.json(users);
});

// Mark notification as read
router.post('/notifications/:id/read', (req, res) => {
    const notificationId = parseInt(req.params.id);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Notification not found' });
    }
});

// Add a new notification
function addNotification(userId, title, message) {
    const notification = {
        id: Date.now(),
        userId,
        title,
        message,
        timestamp: new Date(),
        unread: true
    };
    
    notifications.unshift(notification);
    return notification;
}

module.exports = router;
