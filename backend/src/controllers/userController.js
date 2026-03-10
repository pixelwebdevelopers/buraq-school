const { User, Branch } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/app');

const userController = {
    /**
     * GET /api/users
     * Admin view of all users with pagination and filters
     */
    getUsers: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { branchId, search } = req.query;

            const where = {};
            if (branchId) where.branchId = branchId;
            if (search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { username: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await User.findAndCountAll({
                where,
                include: [{ model: Branch, as: 'branch', attributes: ['name'] }],
                attributes: { exclude: ['password'] },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                success: true,
                users: rows,
                pagination: {
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/users/:id
     * Admin update of user info
     */
    updateUser: async (req, res, next) => {
        try {
            const { name, email, username, phone, role, branchId } = req.body;
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            await user.update({ name, email, username, phone, role, branchId });

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/users/:id/toggle-status
     */
    toggleStatus: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            await user.update({ isActive: !user.isActive });

            res.status(200).json({
                success: true,
                message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
                isActive: user.isActive
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * DELETE /api/users/:id
     */
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Prevent self-deletion
            if (user.id === req.user.id) {
                return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
            }

            await user.destroy();

            res.status(200).json({
                success: true,
                message: 'User deleted permanently'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/users/:id/password
     * Admin override of user password
     */
    updatePasswordAdmin: async (req, res, next) => {
        try {
            const { newPassword } = req.body;
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
            await user.update({ password: hashedPassword });

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/users/profile
     * User self-service update
     */
    updateProfile: async (req, res, next) => {
        try {
            const { name, phone } = req.body;
            const user = await User.findByPk(req.user.id);

            await user.update({ name, phone });

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PATCH /api/users/profile/password
     * User self-service password update
     */
    updateMyPassword: async (req, res, next) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.user.id);

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
            await user.update({ password: hashedPassword });

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
