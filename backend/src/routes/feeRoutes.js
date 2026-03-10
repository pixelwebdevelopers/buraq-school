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

// Family-level fee routes
router.get('/family/:familyId', feeController.getFamilyFees);
router.post('/family/generate', feeController.generateFamilyVouchers);

// Bulk and Reporting routes
router.post('/bulk-generate', feeController.bulkGenerateVouchers);
router.get('/bulk', feeController.getBulkFees);
router.get('/report/pending', feeController.getPendingFeesReport);


module.exports = router;
