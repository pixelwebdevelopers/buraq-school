const { Family, Student, Branch, FeeLog } = require('../models');
const { Op } = require('sequelize');

exports.searchFamilies = async (req, res) => {
    try {
        const { query } = req.query;

        console.log('Searching families with query:', query);

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        const whereClause = {
            [Op.or]: [
                { fatherName: { [Op.like]: `%${query}%` } },
                { fatherPhone: { [Op.like]: `%${query}%` } }
            ]
        };

        // RBAC: If not ADMIN, force branchId to user's branch
        if (req.user.role !== 'ADMIN') {
            whereClause.branchId = req.user.branchId;
        }

        const families = await Family.findAll({
            where: whereClause,
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                },
                {
                    model: FeeLog,
                    attributes: ['amount', 'paidAmount']
                }
            ],
            limit: 20
        });

        // Calculate dynamic balance for each family
        const familiesWithBalance = families.map(family => {
            const familyJSON = family.toJSON();
            const balance = (familyJSON.FeeLogs || []).reduce((acc, log) => {
                return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount));
            }, 0);

            // Remove FeeLogs from the response to keep it clean
            delete familyJSON.FeeLogs;
            return {
                ...familyJSON,
                balance: balance
            };
        });

        res.status(200).json({
            success: true,
            data: familiesWithBalance
        });
    } catch (error) {
        console.error('Error searching families:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching families'
        });
    }
};

exports.lookupFamilyByPhone = async (req, res) => {
    try {
        const { phone, branchId } = req.query;

        if (!phone || !branchId) {
            return res.status(400).json({
                success: false,
                message: 'Phone and branchId are required'
            });
        }

        const whereClause = { fatherPhone: phone };

        // RBAC: If not ADMIN, force branchId to user's branch
        if (req.user.role !== 'ADMIN') {
            whereClause.branchId = req.user.branchId;
        } else if (branchId) {
            whereClause.branchId = branchId;
        } else {
            return res.status(400).json({
                success: false,
                message: 'branchId is required for Admin lookup'
            });
        }

        const family = await Family.findOne({
            where: whereClause,
            include: [
                {
                    model: Student,
                    order: [['createdAt', 'DESC']],
                    limit: 1
                }
            ]
        });

        if (!family) {
            return res.status(404).json({
                success: false,
                message: 'Family not found'
            });
        }

        const familyData = family.toJSON();
        const latestStudent = familyData.Students?.[0] || {};

        // Prepare response with common fields
        const responseData = {
            family: {
                id: familyData.id,
                fatherName: familyData.fatherName,
                fatherPhone: familyData.fatherPhone,
                fatherOccupation: familyData.fatherOccupation
            },
            commonDetails: {
                caste: latestStudent.caste || '',
                religion: latestStudent.religion || '',
                houseNo: latestStudent.houseNo || '',
                streetNo: latestStudent.streetNo || '',
                blockPhase: latestStudent.blockPhase || '',
                mohallahColony: latestStudent.mohallahColony || '',
                cell1: latestStudent.cell1 || '',
                cell2: latestStudent.cell2 || '',
                whatsapp: latestStudent.whatsapp || ''
            }
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Error looking up family:', error);
        res.status(500).json({
            success: false,
            message: 'Error looking up family'
        });
    }
};

exports.getFamilyStudents = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Getting students for family ID: ${id}`);

        const family = await Family.findByPk(id);
        if (!family) {
            return res.status(404).json({ success: false, message: 'Family not found' });
        }

        // RBAC: If not ADMIN, check branchId
        if (req.user.role !== 'ADMIN' && family.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to view this family' });
        }

        const students = await Student.findAll({
            where: { familyId: id },
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                },
                {
                    model: FeeLog,
                    attributes: ['amount', 'paidAmount']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Calculate individual balance for each student
        const studentsWithBalance = students.map(student => {
            const studentJSON = student.toJSON();
            const balance = (studentJSON.FeeLogs || []).reduce((acc, log) => {
                return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount));
            }, 0);

            // Remove FeeLogs from the response
            delete studentJSON.FeeLogs;
            return {
                ...studentJSON,
                balance: balance
            };
        });

        res.status(200).json({
            success: true,
            data: studentsWithBalance
        });
    } catch (error) {
        console.error('Error getting family students:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting family students'
        });
    }
};

exports.updateFamily = async (req, res) => {
    try {
        const { id } = req.params;
        const { fatherName, fatherPhone, fatherOccupation } = req.body;

        const family = await Family.findByPk(id);

        if (!family) {
            return res.status(404).json({
                success: false,
                message: 'Family not found'
            });
        }

        // RBAC: If not ADMIN, check branchId
        if (req.user.role !== 'ADMIN' && family.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this family' });
        }

        // Check if phone number is being updated and if it already exists for another family in the same branch
        if (fatherPhone && fatherPhone !== family.fatherPhone) {
            const existingFamily = await Family.findOne({
                where: { fatherPhone, branchId: family.branchId }
            });

            if (existingFamily) {
                return res.status(400).json({
                    success: false,
                    message: 'A family with this phone number already exists in this branch'
                });
            }
        }

        await family.update({
            fatherName: fatherName || family.fatherName,
            fatherPhone: fatherPhone || family.fatherPhone,
            fatherOccupation: fatherOccupation !== undefined ? fatherOccupation : family.fatherOccupation
        });

        // Fetch the updated family with its Branch and FeeLogs to calculate balance
        const updatedFamilyData = await Family.findByPk(id, {
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                },
                {
                    model: FeeLog,
                    attributes: ['amount', 'paidAmount']
                }
            ]
        });

        const familyJSON = updatedFamilyData.toJSON();
        const balance = (familyJSON.FeeLogs || []).reduce((acc, log) => {
            return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount));
        }, 0);

        delete familyJSON.FeeLogs;
        const finalFamily = {
            ...familyJSON,
            balance: balance
        };

        res.status(200).json({
            success: true,
            message: 'Family updated successfully',
            data: finalFamily
        });
    } catch (error) {
        console.error('Error updating family:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating family'
        });
    }
};
