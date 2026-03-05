const jwt = require('jsonwebtoken');
const config = require('../config/app');

/**
 * Authentication middleware.
 * Verifies JWT token from Authorization header or cookies.
 */
function authenticate(req, res, next) {
    try {
        // Extract token from Authorization header or cookies
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            const error = new Error('Access denied. No token provided.');
            error.statusCode = 401;
            throw error;
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            err.statusCode = 401;
            err.message = 'Invalid or expired token.';
        }
        next(err);
    }
}

/**
 * Authorization middleware factory.
 * Restricts access to specified roles.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'teacher')
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const error = new Error('Forbidden. Insufficient permissions.');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
}

module.exports = { authenticate, authorize };
