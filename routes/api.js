const express = require('express');
const router = express.Router();
const vehicles = require('../data/vehiclesSeed');

// GET /api/vehicles - Get all vehicles
router.get('/vehicles', (req, res) => {
    res.json(vehicles);
});

// POST /api/vehicles - Add new vehicle
router.post('/vehicles', (req, res) => {
    const newVehicle = {
        id: vehicles.length + 1,
        ...req.body,
        status: 'active'
    };
    vehicles.push(newVehicle);
    res.json(newVehicle);
});

// GET /api/sites - Get all sites (dummy data for now)
router.get('/sites', (req, res) => {
    const sites = [
        { id: 1, name: "Main Depot - Johannesburg" },
        { id: 2, name: "Pretoria Distribution Center" },
        { id: 3, name: "Sandton Service Hub" }
    ];
    res.json(sites);
});

// GET /api/users/list - Get all users
router.get('/users/list', (req, res) => {
    // For now, return a dummy list of users
    const users = [
        { id: 1, name: 'Admin User', role: 'CLIENT_ADMIN' },
        { id: 2, name: 'Driver User', role: 'DRIVER' }
    ];
    res.json(users);
});

// GET /api/messages - Get messages for the logged-in user
router.get('/messages', (req, res) => {
    // Dummy messages for testing
    const messages = [
        { id: 1, sender: 'Admin User', timestamp: new Date(), unread: true },
        { id: 2, sender: 'Driver User', timestamp: new Date(), unread: false }
    ];
    res.json(messages);
});

module.exports = router;
