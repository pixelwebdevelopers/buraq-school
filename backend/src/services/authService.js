/**
 * Auth Service
 * Business logic for authentication.
 * TODO: Implement full auth logic when building the feature.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const User = require('../models/User');

const authService = {
    /**
     * Register a new user.
     * @param {Object} userData - { name, email, password, role }
     * @returns {Promise<Object>} - Created user (no password)
     */
    register: async (userData) => {
        // Check if user already exists
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('A user with this email already exists.');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, config.bcryptSaltRounds);

        // Create user
        const user = await User.create({ ...userData, password: hashedPassword });
        return user;
    },

    /**
     * Authenticate a user and return a JWT.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>} - { user, token }
     */
    login: async (email, password) => {
        const user = await User.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },
};

module.exports = authService;
