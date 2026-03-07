const { Branch, User, Student, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

const branchController = {
    // Get all branches with their principal details and student count
    getBranches: async (req, res, next) => {
        try {
            const branches = await Branch.findAll({
                include: [
                    {
                        model: User,
                        as: 'principal',
                        attributes: ['id', 'name', 'email', 'username', 'phone']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const branchesWithCount = await Promise.all(branches.map(async (branch) => {
                const studentCount = await Student.count({ where: { branchId: branch.id } });
                return { ...branch.toJSON(), studentCount };
            }));

            res.status(200).json({
                success: true,
                data: branchesWithCount
            });
        } catch (error) {
            next(error);
        }
    },

    // Get single branch
    getBranchById: async (req, res, next) => {
        try {
            const branch = await Branch.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'principal',
                        attributes: ['id', 'name', 'email', 'username', 'phone']
                    }
                ]
            });

            if (!branch) {
                const err = new Error('Branch not found');
                err.statusCode = 404;
                throw err;
            }

            const studentCount = await Student.count({ where: { branchId: branch.id } });

            res.status(200).json({
                success: true,
                data: { ...branch.toJSON(), studentCount }
            });
        } catch (error) {
            next(error);
        }
    },

    // Create a new branch along with a Principal account
    createBranch: async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { name, address, principalName, principalEmail, principalUsername, principalPassword, principalPhone } = req.body;

            if (!name || !address || !principalName || !principalEmail || !principalUsername || !principalPassword) {
                const err = new Error('Please provide all required fields');
                err.statusCode = 400;
                throw err;
            }

            // Check if principal username or email already exists
            const existingUser = await User.findOne({
                where: {
                    [sequelize.Sequelize.Op.or]: [{ email: principalEmail }, { username: principalUsername }]
                },
                transaction: t
            });

            if (existingUser) {
                const err = new Error('User with this email or username already exists');
                err.statusCode = 400;
                throw err;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(principalPassword, 10);

            // Create Principal User
            const principalUser = await User.create({
                name: principalName,
                email: principalEmail,
                username: principalUsername,
                password: hashedPassword,
                phone: principalPhone || null,
                role: 'PRINCIPAL'
            }, { transaction: t });

            // Create Branch
            const branch = await Branch.create({
                name,
                address,
                principalId: principalUser.id
            }, { transaction: t });

            // Update principal user to link with the created branch (branchId)
            await principalUser.update({ branchId: branch.id }, { transaction: t });

            await t.commit();

            res.status(201).json({
                success: true,
                message: 'Branch and Principal account created successfully',
                data: branch
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    },

    // Update branch and principal details
    updateBranch: async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const { name, address, principalName, principalEmail, principalUsername, principalPassword, principalPhone } = req.body;

            const branch = await Branch.findByPk(req.params.id, { transaction: t });

            if (!branch) {
                const err = new Error('Branch not found');
                err.statusCode = 404;
                throw err;
            }

            // Update Branch Details
            if (name) branch.name = name;
            if (address) branch.address = address;
            await branch.save({ transaction: t });

            // Update Principal Details
            if (branch.principalId) {
                const principal = await User.findByPk(branch.principalId, { transaction: t });
                if (principal) {
                    if (principalName) principal.name = principalName;

                    // Check email/username duplicates if changed
                    if ((principalEmail && principalEmail !== principal.email) ||
                        (principalUsername && principalUsername !== principal.username)) {

                        const condition = [];
                        if (principalEmail && principalEmail !== principal.email) condition.push({ email: principalEmail });
                        if (principalUsername && principalUsername !== principal.username) condition.push({ username: principalUsername });

                        const existingUser = await User.findOne({
                            where: {
                                [sequelize.Sequelize.Op.or]: condition,
                                id: { [sequelize.Sequelize.Op.ne]: principal.id }
                            },
                            transaction: t
                        });

                        if (existingUser) {
                            const err = new Error('Email or Username is already in use by another user');
                            err.statusCode = 400;
                            throw err;
                        }
                    }

                    if (principalEmail) principal.email = principalEmail;
                    if (principalUsername) principal.username = principalUsername;
                    if (principalPhone) principal.phone = principalPhone;

                    if (principalPassword) {
                        principal.password = await bcrypt.hash(principalPassword, 10);
                    }

                    await principal.save({ transaction: t });
                }
            }

            await t.commit();

            res.status(200).json({
                success: true,
                message: 'Branch updated successfully'
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
};

module.exports = branchController;
