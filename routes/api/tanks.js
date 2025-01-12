const express = require('express');
const router = express.Router();

// Mock data for development
let tanks = [
    {
        id: 1,
        siteId: 1,
        name: 'Tank A1',
        capacity: 50000,
        fuelType: 'diesel',
        latitude: -26.2041,
        longitude: 28.0473,
        pumpOdometer: 0,
        lastInspection: '2025-01-01',
        notes: 'Main diesel tank'
    }
];

// Get all tanks
router.get('/', (req, res) => {
    res.json(tanks);
});

// Get tanks for a specific site
router.get('/site/:siteId', (req, res) => {
    const siteId = parseInt(req.params.siteId);
    const siteTanks = tanks.filter(tank => tank.siteId === siteId);
    res.json(siteTanks);
});

// Get a specific tank
router.get('/:id', (req, res) => {
    const tankId = parseInt(req.params.id);
    const tank = tanks.find(t => t.id === tankId);
    if (tank) {
        res.json(tank);
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

// Add a new tank
router.post('/', (req, res) => {
    const newTank = {
        id: Date.now(),
        ...req.body
    };
    tanks.push(newTank);
    res.status(201).json(newTank);
});

// Update a tank
router.put('/:id', (req, res) => {
    const tankId = parseInt(req.params.id);
    const tankIndex = tanks.findIndex(t => t.id === tankId);
    
    if (tankIndex !== -1) {
        tanks[tankIndex] = {
            ...tanks[tankIndex],
            ...req.body,
            id: tankId
        };
        res.json(tanks[tankIndex]);
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

// Delete a tank
router.delete('/:id', (req, res) => {
    const tankId = parseInt(req.params.id);
    const tankIndex = tanks.findIndex(t => t.id === tankId);
    
    if (tankIndex !== -1) {
        tanks.splice(tankIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

module.exports = router;
