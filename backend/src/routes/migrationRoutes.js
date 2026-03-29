const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');

/**
 * Migration Routes
 * Path: /api/system
 */

// POST /api/system/migrate - Run database migrations
router.post('/migrate', migrationController.migrate);

// POST /api/system/seed - Run database seeders
router.post('/seed', migrationController.seed);

// POST /api/system/sync - Run database sync (alter: true)
router.post('/sync', migrationController.sync);

module.exports = router;
