const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginValidator, registerValidator } = require('../validators/authValidator');
const { validate } = require('../middleware/validate');

/**
 * Auth Routes
 * POST /api/auth/register  → Register a new user
 * POST /api/auth/login     → Login with credentials
 * POST /api/auth/logout    → Logout
 * GET  /api/auth/me        → Get current user profile (protected)
 */
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getProfile);

module.exports = router;
