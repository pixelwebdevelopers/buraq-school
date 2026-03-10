const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Only ADMIN can access branch management endpoints
router.use(authorize('ADMIN'));

router.route('/')
    .get(branchController.getBranches)
    .post(branchController.createBranch);

router.route('/:id')
    .get(branchController.getBranchById)
    .put(branchController.updateBranch);

module.exports = router;
