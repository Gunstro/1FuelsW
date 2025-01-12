const express = require('express');
const router = express.Router();

// Mock data for development
let sites = [
    {
        id: 1,
        name: 'Main Depot',
        address: '123 Main Road, Johannesburg',
        latitude: -26.2041,
        longitude: 28.0473,
        notes: 'Main distribution center'
    }
];

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

// Mock readings data
const generateMockReadings = (tankId, days = 30) => {
    const readings = [];
    let currentLevel = Math.random() * 40000 + 5000; // Random start between 5000L and 45000L

    for (let i = days; i >= 0; i--) {
        const change = Math.random() * 2000 - 1000; // Random change between -1000L and +1000L
        currentLevel = Math.max(0, Math.min(50000, currentLevel + change));
        
        readings.push({
            tankId,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            level: Math.round(currentLevel),
            change: Math.round(change),
            temperature: Math.round(Math.random() * 10 + 20), // Random temp between 20-30°C
            status: Math.random() > 0.9 ? 'warning' : 'normal' // 10% chance of warning
        });
    }

    return readings;
};

// Get all sites
router.get('/sites', (req, res) => {
    res.json(sites);
});

// Add new site
router.post('/sites', (req, res) => {
    const site = {
        id: Date.now(),
        ...req.body
    };
    sites.push(site);
    res.json(site);
});

// Get site by ID
router.get('/sites/:id', (req, res) => {
    const site = sites.find(s => s.id === parseInt(req.params.id));
    if (site) {
        res.json(site);
    } else {
        res.status(404).json({ error: 'Site not found' });
    }
});

// Update site
router.put('/sites/:id', (req, res) => {
    const index = sites.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        sites[index] = { ...sites[index], ...req.body };
        res.json(sites[index]);
    } else {
        res.status(404).json({ error: 'Site not found' });
    }
});

// Delete site
router.delete('/sites/:id', (req, res) => {
    const index = sites.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        sites.splice(index, 1);
        // Also delete associated tanks
        tanks = tanks.filter(t => t.siteId !== parseInt(req.params.id));
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Site not found' });
    }
});

// Get all tanks
router.get('/tanks', (req, res) => {
    // Add current level to each tank
    const tanksWithLevels = tanks.map(tank => {
        const readings = generateMockReadings(tank.id, 30);
        const currentReading = readings[readings.length - 1];
        return {
            ...tank,
            currentLevel: currentReading.level,
            fillLevel: Math.round((currentReading.level / tank.capacity) * 100)
        };
    });
    res.json(tanksWithLevels);
});

// Add new tank
router.post('/tanks', (req, res) => {
    const tank = {
        id: Date.now(),
        ...req.body
    };
    tanks.push(tank);
    res.json(tank);
});

// Get tank details by ID
router.get('/tanks/:id/details', (req, res) => {
    const tank = tanks.find(t => t.id === parseInt(req.params.id));
    if (tank) {
        const readings = generateMockReadings(tank.id, 30);
        const currentReading = readings[readings.length - 1];
        res.json({
            ...tank,
            readings,
            currentLevel: currentReading.level,
            fillLevel: Math.round((currentReading.level / tank.capacity) * 100)
        });
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

// Update tank
router.put('/tanks/:id', (req, res) => {
    const index = tanks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        tanks[index] = { ...tanks[index], ...req.body };
        res.json(tanks[index]);
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

// Delete tank
router.delete('/tanks/:id', (req, res) => {
    const index = tanks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        tanks.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Tank not found' });
    }
});

// Get all sites
router.get('/', (req, res) => {
    res.json(sites);
});

// Create new site
router.post('/', (req, res) => {
    try {
        const { name, address, latitude, longitude, notes } = req.body;
        
        // Validate required fields
        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ 
                error: 'Missing required fields' 
            });
        }

        // Create new site
        const newSite = {
            id: Date.now(),
            name,
            address,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            notes: notes || '',
            tanks: []
        };

        // Add to sites array
        sites.push(newSite);

        // Return new site
        res.status(201).json(newSite);
    } catch (error) {
        console.error('Error creating site:', error);
        res.status(500).json({ error: 'Failed to create site' });
    }
});

// Get a specific site
router.get('/:id', (req, res) => {
    const site = sites.find(s => s.id === parseInt(req.params.id));
    if (site) {
        res.json(site);
    } else {
        res.status(404).json({ error: 'Site not found' });
    }
});

// Get tanks for a site
router.get('/:id/tanks', (req, res) => {
    const siteTanks = tanks.filter(t => t.siteId === parseInt(req.params.id));
    res.json(siteTanks);
});

// Get readings for a tank
router.get('/:siteId/tanks/:tankId/readings', (req, res) => {
    const tank = tanks.find(t => 
        t.siteId === parseInt(req.params.siteId) && 
        t.id === parseInt(req.params.tankId)
    );
    
    if (!tank) {
        return res.status(404).json({ error: 'Tank not found' });
    }
    
    const readings = generateMockReadings(tank.id);
    res.json(readings);
});

module.exports = router;
