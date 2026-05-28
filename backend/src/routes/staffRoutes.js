const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// Only ADMIN and PRINCIPAL can manage staff
router.use(authorize('ADMIN', 'PRINCIPAL'));

router.route('/')
    .get(staffController.getStaff)
    .post(staffController.createStaff);

router.route('/:id')
    .get(staffController.getStaffById)
    .put(staffController.updateStaff)
    .delete(staffController.deleteStaff);

module.exports = router;
