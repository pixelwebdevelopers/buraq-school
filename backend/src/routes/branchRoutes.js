const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

router.route('/')
    .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF'), branchController.getBranches)
    .post(authorize('ADMIN'), branchController.createBranch);

router.route('/:id')
    .get(authorize('ADMIN', 'PRINCIPAL', 'STAFF'), branchController.getBranchById)
    .put(authorize('ADMIN'), branchController.updateBranch);

module.exports = router;
