const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authenticate } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// GET /api/fees/student/:studentId
router.get('/student/:studentId', feeController.getStudentFees);

// POST /api/fees/generate
router.post('/generate', feeController.generateVoucher);

// PUT /api/fees/:id/pay
router.put('/:id/pay', feeController.payVoucher);

module.exports = router;
