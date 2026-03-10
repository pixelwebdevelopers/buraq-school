const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Self-service routes (Available to all logged-in users)
router.put('/profile', protect, userController.updateProfile);
router.patch('/profile/password', protect, userController.updateMyPassword);

// Admin-only management routes
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.patch('/:id/toggle-status', userController.toggleStatus);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/password', userController.updatePasswordAdmin);

module.exports = router;
