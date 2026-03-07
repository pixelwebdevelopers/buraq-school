/**
 * Auth Controller
 * Handles authentication-related request/response logic.
 * Business logic should be delegated to services.
 */

const authController = {
    /**
     * POST /api/auth/register
     */
    register: async (req, res, next) => {
        try {
            // TODO: Implement registration logic via authService
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { identifier, password } = req.body;
            const authService = require('../services/authService');
            const { user, token } = await authService.login(identifier, password);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/auth/logout
     */
    logout: async (req, res, next) => {
        try {
            res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/auth/forgot-password
     */
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const authService = require('../services/authService');
            await authService.forgotPassword(email);

            res.status(200).json({
                success: true,
                message: 'Password reset link sent to your email',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/auth/reset-password
     */
    resetPassword: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const authService = require('../services/authService');
            await authService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Password has been reset successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/auth/me
     */
    getProfile: async (req, res, next) => {
        try {
            // Fetch user profile from database
            const { User } = require('../models');
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = authController;
