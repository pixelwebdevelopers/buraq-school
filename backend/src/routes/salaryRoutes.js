const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN', 'PRINCIPAL'));

router.get('/sheet', salaryController.getMonthlySheet);
router.get('/slips/history', salaryController.getStaffSlipHistory);

router.post('/slips', salaryController.upsertSlip);
router.delete('/slips/:id', salaryController.deleteSlip);

router.post('/expenses', salaryController.addExpense);
router.put('/expenses/:id', salaryController.updateExpense);
router.delete('/expenses/:id', salaryController.deleteExpense);

module.exports = router;
