const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// All roles can access students, but controllers enforce the branch scope
router.route('/')
    .get(studentController.getStudents)
    .post(studentController.admitStudent);

router.route('/:id')
    .put(studentController.updateStudent);

module.exports = router;
