const express = require('express');
const router = express.Router();

router.post('/refuel', (req, res) => {
    res.json({
        success: true,
        message: 'Refueling recorded'
    });
});

module.exports = router;
