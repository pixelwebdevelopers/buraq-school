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

    /**
     * POST /api/auth/login
     */
    login: async (req, res, next) => {
        try {
            // TODO: Implement login logic via authService
            res.status(200).json({
                success: true,
                message: 'Login successful',
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
     * GET /api/auth/me
     */
    getProfile: async (req, res, next) => {
        try {
            // TODO: Fetch user profile from database
            res.status(200).json({
                success: true,
                user: req.user,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = authController;
