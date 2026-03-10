const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// GET /api/fees/student/:studentId
router.get('/student/:studentId', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.getStudentFees);

// POST /api/fees/generate
router.post('/generate', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.generateVoucher);

// PUT /api/fees/:id/pay
router.put('/:id/pay', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.payVoucher);

// Family-level fee routes
router.get('/family/:familyId', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.getFamilyFees);
router.post('/family/generate', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.generateFamilyVouchers);

// Bulk management routes (Allowed for STAFF/PRINCIPAL/ADMIN)
router.post('/bulk-generate', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.bulkGenerateVouchers);
router.get('/bulk', authorize('ADMIN', 'PRINCIPAL', 'STAFF'), feeController.getBulkFees);

// Reporting routes (Restricted to ADMIN/PRINCIPAL)
router.get('/report/pending', authorize('ADMIN', 'PRINCIPAL'), feeController.getPendingFeesReport);


module.exports = router;
