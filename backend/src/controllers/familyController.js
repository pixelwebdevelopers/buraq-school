const { Family, Student, Branch } = require('../models');
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

        const families = await Family.findAll({
            where: {
                [Op.or]: [
                    { fatherName: { [Op.like]: `%${query}%` } },
                    { fatherPhone: { [Op.like]: `%${query}%` } }
                ]
            },
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                }
            ],
            limit: 20
        });

        res.status(200).json({
            success: true,
            data: families
        });
    } catch (error) {
        console.error('Error searching families:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching families'
        });
    }
};

exports.getFamilyStudents = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Getting students for family ID: ${id}`);

        const students = await Student.findAll({
            where: { familyId: id },
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: students
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
        const { fatherName, fatherPhone, fatherOccupation, balance } = req.body;

        const family = await Family.findByPk(id);

        if (!family) {
            return res.status(404).json({
                success: false,
                message: 'Family not found'
            });
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
            fatherOccupation: fatherOccupation !== undefined ? fatherOccupation : family.fatherOccupation,
            balance: balance !== undefined ? balance : family.balance
        });

        // Fetch the updated family with its Branch to return complete data
        const updatedFamily = await Family.findByPk(id, {
            include: [
                {
                    model: Branch,
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Family updated successfully',
            data: updatedFamily
        });
    } catch (error) {
        console.error('Error updating family:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating family'
        });
    }
};
