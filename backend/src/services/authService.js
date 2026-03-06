/**
 * Auth Service
 * Business logic for authentication using Prisma.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const { User } = require('../models');

const authService = {
    /**
     * Register a new user.
     * @param {Object} userData - { name, email, username, password, phone, role, branchId }
     * @returns {Promise<Object>} - Created user (no password)
     */
    register: async (userData) => {
        // Check if email already exists
        const existingEmail = await User.findByEmail(userData.email);
        if (existingEmail) {
            const error = new Error('A user with this email already exists.');
            error.statusCode = 409;
            throw error;
        }

        // Check if username already exists
        const existingUsername = await User.findByUsername(userData.username);
        if (existingUsername) {
            const error = new Error('A user with this username already exists.');
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
     * Supports login via email or username.
     * @param {string} identifier - email or username
     * @param {string} password
     * @returns {Promise<Object>} - { user, token }
     */
    login: async (identifier, password) => {
        const user = await User.findByEmailOrUsername(identifier);
        if (!user) {
            const error = new Error('Invalid credentials.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid credentials.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, branchId: user.branchId },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },
};

module.exports = authService;
