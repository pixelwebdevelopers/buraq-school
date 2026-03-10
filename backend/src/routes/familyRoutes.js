const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { authenticate } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// GET /api/families/search
router.get('/search', familyController.searchFamilies);

// GET /api/families/lookup
router.get('/lookup', familyController.lookupFamilyByPhone);

// GET /api/families/:id/students
router.get('/:id/students', familyController.getFamilyStudents);

// PUT /api/families/:id
router.put('/:id', familyController.updateFamily);

module.exports = router;
