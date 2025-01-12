const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Vehicles route working' });
});

router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        name: 'Test Vehicle',
        type: 'Car',
        fuelCapacity: 50
    });
});

module.exports = router;
