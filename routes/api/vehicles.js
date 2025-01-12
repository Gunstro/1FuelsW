const express = require('express');
const router = express.Router();
let vehicles = require('../../data/vehiclesSeed');

// GET /api/vehicles - Get all vehicles
router.get('/', (req, res) => {
    res.json(vehicles);
});

// POST /api/vehicles - Add new vehicle
router.post('/', (req, res) => {
    const newVehicle = {
        id: vehicles.length + 1,
        ...req.body,
        status: 'active',
        lastMaintenance: req.body.lastMaintenance || new Date().toISOString().split('T')[0]
    };
    vehicles.push(newVehicle);
    res.json(newVehicle);
});

module.exports = router;
