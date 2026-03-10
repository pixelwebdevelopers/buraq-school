const { User, Branch } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/app');

const userController = {
    /**
     * GET /api/users
     * Management view of users with pagination and filters
     */
    getUsers: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            let { branchId, search } = req.query;

            // Principals can only see users from their own branch
            if (req.user.role === 'PRINCIPAL') {
                branchId = req.user.branchId;
            }

            const where = {
                id: { [Op.ne]: req.user.id } // Don't show the current user in the list
            };
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
     * POST /api/users
     * Create a new user (Admin or Principal)
     */
    createUser: async (req, res, next) => {
        try {
            let { name, email, username, password, phone, role, branchId } = req.body;

            // Role and Branch constraints for Principals
            if (req.user.role === 'PRINCIPAL') {
                role = 'STAFF'; // Principals can only create STAFF
                branchId = req.user.branchId; // Principals can only create users for their branch
            }

            // Check if email already exists
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }

            // Check if username already exists
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(409).json({ success: false, message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
            const user = await User.create({
                name, email, username, phone, role, branchId,
                password: hashedPassword,
                isActive: true
            });

            const userJson = user.toJSON();
            delete userJson.password;

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: userJson
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/users/:id
     * Update user info
     */
    updateUser: async (req, res, next) => {
        try {
            let { name, email, username, phone, role, branchId } = req.body;
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Security: Principals can only update their own branch users
            if (req.user.role === 'PRINCIPAL' && user.branchId !== req.user.branchId) {
                return res.status(403).json({ success: false, message: 'Access denied: User belongs to another branch' });
            }

            // Security: Prevent Principals from promoting to ADMIN
            if (req.user.role === 'PRINCIPAL') {
                role = user.role; // Principals cannot change roles
                branchId = user.branchId; // Principals cannot change branches
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

            // Security: Principals can only toggle status for their own branch users
            if (req.user.role === 'PRINCIPAL' && user.branchId !== req.user.branchId) {
                return res.status(403).json({ success: false, message: 'Access denied' });
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

            // Security: Principals can only delete their own branch users
            if (req.user.role === 'PRINCIPAL' && user.branchId !== req.user.branchId) {
                return res.status(403).json({ success: false, message: 'Access denied' });
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
     * Password override
     */
    updatePasswordAdmin: async (req, res, next) => {
        try {
            const { newPassword } = req.body;
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Security: Principals can only change passwords for their own branch users
            if (req.user.role === 'PRINCIPAL' && user.branchId !== req.user.branchId) {
                return res.status(403).json({ success: false, message: 'Access denied' });
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
            const { name, phone, email, username } = req.body;
            const user = await User.findByPk(req.user.id);

            // Check if email is being changed and if it's already taken
            if (email && email !== user.email) {
                const existingEmail = await User.findOne({ where: { email } });
                if (existingEmail) {
                    return res.status(400).json({ success: false, message: 'Email is already in use' });
                }
            }

            // Check if username is being changed and if it's already taken
            if (username && username !== user.username) {
                const existingUsername = await User.findOne({ where: { username } });
                if (existingUsername) {
                    return res.status(400).json({ success: false, message: 'Username is already in use' });
                }
            }

            await user.update({ name, phone, email, username });

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: { id: user.id, name: user.name, phone: user.phone, email: user.email, username: user.username, role: user.role }
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
