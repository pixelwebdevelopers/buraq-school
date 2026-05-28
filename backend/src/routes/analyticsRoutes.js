const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN', 'PRINCIPAL'));

router.get('/financial', analyticsController.getFinancialOverview);

module.exports = router;
