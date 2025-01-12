const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
    // For now, return a dummy list of users
    const users = [
        { id: 1, name: 'Admin User', role: 'CLIENT_ADMIN' },
        { id: 2, name: 'Driver User', role: 'DRIVER' }
    ];
    res.json(users);
});

module.exports = router;
