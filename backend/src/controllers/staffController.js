const { Staff, Branch, sequelize } = require('../models');
const { Op } = require('sequelize');

const staffController = {
    // GET /api/staff — list with search/filter, role-scoped
    getStaff: async (req, res, next) => {
        try {
            const { search, branchId, profession } = req.query;
            const whereClause = {};

            if (req.user.role !== 'ADMIN') {
                whereClause.branchId = req.user.branchId;
            } else if (branchId) {
                whereClause.branchId = branchId;
            }

            if (profession) {
                whereClause.profession = profession;
            }

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { profession: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { cnic: { [Op.like]: `%${search}%` } }
                ];
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows: staff } = await Staff.findAndCountAll({
                where: whereClause,
                include: [{ model: Branch, attributes: ['id', 'name'] }],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            res.status(200).json({
                success: true,
                data: staff,
                pagination: {
                    totalCount: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/staff/:id
    getStaffById: async (req, res, next) => {
        try {
            const staff = await Staff.findByPk(req.params.id, {
                include: [{ model: Branch, attributes: ['id', 'name'] }]
            });
            if (!staff) {
                const err = new Error('Staff member not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && staff.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized');
                err.statusCode = 403;
                throw err;
            }
            res.status(200).json({ success: true, data: staff });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/staff
    createStaff: async (req, res, next) => {
        try {
            const {
                name, profession, baseSalary, medicalLeaves,
                phone, cnic, address, joiningDate, status, branchId
            } = req.body;

            if (!name || !profession || baseSalary === undefined || baseSalary === null) {
                const err = new Error('Name, profession and base salary are required.');
                err.statusCode = 400;
                throw err;
            }

            let targetBranchId = req.user.branchId;
            if (req.user.role === 'ADMIN') {
                if (!branchId) {
                    const err = new Error('Branch ID is required for Admins when adding a staff member.');
                    err.statusCode = 400;
                    throw err;
                }
                targetBranchId = branchId;
            }

            const staff = await Staff.create({
                name,
                profession,
                baseSalary,
                medicalLeaves: medicalLeaves || 0,
                phone,
                cnic,
                address,
                joiningDate: joiningDate || null,
                status: status || 'ACTIVE',
                branchId: targetBranchId
            });

            res.status(201).json({
                success: true,
                message: 'Staff member added successfully',
                data: staff
            });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/staff/:id
    updateStaff: async (req, res, next) => {
        try {
            const staff = await Staff.findByPk(req.params.id);
            if (!staff) {
                const err = new Error('Staff member not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && staff.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized to edit this staff member');
                err.statusCode = 403;
                throw err;
            }

            const {
                name, profession, baseSalary, medicalLeaves,
                phone, cnic, address, joiningDate, status
            } = req.body;

            await staff.update({
                name: name !== undefined ? name : staff.name,
                profession: profession !== undefined ? profession : staff.profession,
                baseSalary: baseSalary !== undefined ? baseSalary : staff.baseSalary,
                medicalLeaves: medicalLeaves !== undefined ? medicalLeaves : staff.medicalLeaves,
                phone: phone !== undefined ? phone : staff.phone,
                cnic: cnic !== undefined ? cnic : staff.cnic,
                address: address !== undefined ? address : staff.address,
                joiningDate: joiningDate !== undefined ? joiningDate : staff.joiningDate,
                status: status !== undefined ? status : staff.status
            });

            res.status(200).json({
                success: true,
                message: 'Staff member updated successfully',
                data: staff
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/staff/:id
    deleteStaff: async (req, res, next) => {
        try {
            const staff = await Staff.findByPk(req.params.id);
            if (!staff) {
                const err = new Error('Staff member not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && staff.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized to delete this staff member');
                err.statusCode = 403;
                throw err;
            }
            await staff.destroy();
            res.status(200).json({ success: true, message: 'Staff member deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = staffController;
