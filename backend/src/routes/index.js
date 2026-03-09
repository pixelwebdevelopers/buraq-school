const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const branchRoutes = require('./branchRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const studentRoutes = require('./studentRoutes');
const familyRoutes = require('./familyRoutes');

/**
 * API Route Index
 *
 * All routes are prefixed with /api (set in app.js).
 * ├── /auth       → Authentication routes
 * ├── /branches   → Branch management routes
 * ├── /dashboard  → Dashboard statistics
 * ├── /students   → Student management routes
 * ├── /families   → Family tree management routes
 * └── ...         → Future module routes
 */
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/students', studentRoutes);
router.use('/families', familyRoutes);

module.exports = router;
