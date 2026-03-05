const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

/**
 * API Route Index
 *
 * All routes are prefixed with /api (set in app.js).
 * ├── /auth   → Authentication routes
 * └── ...     → Future module routes
 */
router.use('/auth', authRoutes);

module.exports = router;
