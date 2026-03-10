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

        // Check if user is active
        if (user.isActive === false) {
            const error = new Error('Your account has been disabled. Please contact the administrator.');
            error.statusCode = 403;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, branchId: user.branchId },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        const plainUser = user.get ? user.get({ plain: true }) : user;
        const { password: _, ...userWithoutPassword } = plainUser;
        return { user: userWithoutPassword, token };
    },

    /**
     * Generate password reset token and send email
     */
    forgotPassword: async (email) => {
        const user = await User.findByEmail(email);
        if (!user) {
            const error = new Error('No user found with that email address.');
            error.statusCode = 404;
            throw error;
        }

        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            auth: config.smtpUser ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
            ignoreTLS: config.smtpPort === 1025
        });

        const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}&email=${email}`;

        await transporter.sendMail({
            from: '"Buraq School Admin" <noreply@buraqschool.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to set a new password:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>
                   <p>If you did not request this, please ignore this email.</p>`
        });
    },

    /**
     * Reset password using token
     */
    resetPassword: async (token, newPassword) => {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken: hash,
                resetPasswordExpires: {
                    [require('sequelize').Op.gt]: Date.now()
                }
            }
        });

        if (!user) {
            const error = new Error('Token is invalid or has expired.');
            error.statusCode = 400;
            throw error;
        }

        user.password = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
    },
};

module.exports = authService;
