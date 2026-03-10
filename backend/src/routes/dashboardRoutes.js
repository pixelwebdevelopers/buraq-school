const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

router.route('/stats')
    .get(dashboardController.getStats);

module.exports = router;
