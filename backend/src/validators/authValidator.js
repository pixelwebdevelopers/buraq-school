const { body } = require('express-validator');

/**
 * Validation rules for login request.
 */
const loginValidator = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Please provide your email or username'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

/**
 * Validation rules for registration request.
 */
const registerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['admin', 'teacher', 'student', 'parent'])
        .withMessage('Invalid role'),
];

module.exports = { loginValidator, registerValidator };
