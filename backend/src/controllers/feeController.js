const { FeeLog, Student, Family, Branch } = require('../models');
const { Op } = require('sequelize');

exports.getStudentFees = async (req, res) => {
    try {
        const { studentId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        const { count, rows } = await FeeLog.findAndCountAll({
            where: { studentId },
            order: [['year', 'DESC'], ['month', 'DESC'], ['createdAt', 'DESC']],
            limit,
            offset
        });

        // Calculate total pending balance across all unpaid/partial vouchers
        const allPendingLogs = await FeeLog.findAll({
            where: {
                studentId,
                status: { [Op.in]: ['PENDING', 'PARTIAL'] }
            }
        });

        const totalBalance = allPendingLogs.reduce((acc, log) => {
            return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount || 0));
        }, 0);

        res.status(200).json({
            success: true,
            data: {
                vouchers: rows,
                totalBalance,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        });
    } catch (error) {
        console.error('Error fetching student fees:', error);
        res.status(500).json({ success: false, message: 'Error fetching fees.' });
    }
};

exports.generateVoucher = async (req, res) => {
    try {
        const { studentId, month, year } = req.body;

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        // Check if voucher already exists for this month/year
        const existingLog = await FeeLog.findOne({
            where: { studentId, month, year }
        });

        if (existingLog) {
            return res.status(400).json({ success: false, message: `Voucher already exists for ${month}/${year}.` });
        }

        // Calculate total amount based on student's current assigned fees
        const monthlyFee = parseFloat(student.monthlyFee || 0);
        const academyFee = parseFloat(student.academyFee || 0);
        const labMiscFee = parseFloat(student.labMiscFee || 0);
        const totalAmount = monthlyFee + academyFee + labMiscFee;

        // Ensure totalAmount is greater than 0
        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Student has no assigned fees to generate a voucher for.' });
        }

        const newVoucher = await FeeLog.create({
            familyId: student.familyId,
            studentId,
            month,
            year,
            monthlyFee,
            academyFee,
            labMiscFee,
            amount: totalAmount,
            paidAmount: 0,
            status: 'PENDING',
            type: 'monthly_voucher',
            description: `Monthly Fee Voucher for ${month}/${year}`
        });

        res.status(201).json({
            success: true,
            message: 'Voucher generated successfully.',
            data: newVoucher
        });
    } catch (error) {
        console.error('Error generating voucher:', error);
        res.status(500).json({ success: false, message: 'Error generating voucher.' });
    }
};

exports.payVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { paidAmount } = req.body;

        const voucher = await FeeLog.findByPk(id);
        if (!voucher) {
            return res.status(404).json({ success: false, message: 'Voucher not found.' });
        }

        if (voucher.status === 'PAID') {
            return res.status(400).json({ success: false, message: 'Voucher is already fully paid.' });
        }

        const newPaidAmount = parseFloat(paidAmount);
        if (newPaidAmount < 0) {
            return res.status(400).json({ success: false, message: 'Paid amount cannot be negative.' });
        }

        const totalAmount = parseFloat(voucher.amount);

        if (newPaidAmount > totalAmount) {
            return res.status(400).json({ success: false, message: 'Paid amount cannot exceed the total voucher amount.' });
        }

        let newStatus = 'PENDING';
        if (newPaidAmount === totalAmount) {
            newStatus = 'PAID';
        } else if (newPaidAmount > 0) {
            newStatus = 'PARTIAL';
        }

        await voucher.update({
            paidAmount: newPaidAmount,
            status: newStatus
        });

        res.status(200).json({
            success: true,
            message: 'Payment updated successfully.',
            data: voucher
        });
    } catch (error) {
        console.error('Error updating voucher payment:', error);
        res.status(500).json({ success: false, message: 'Error updating payment.' });
    }
};

exports.getFamilyFees = async (req, res) => {
    try {
        const { familyId } = req.params;

        // Verify family exists
        const family = await Family.findByPk(familyId);
        if (!family) {
            return res.status(404).json({ success: false, message: 'Family not found.' });
        }

        // Fetch all fee logs for all students in this family
        const feeLogs = await FeeLog.findAll({
            where: { familyId },
            include: [{
                model: Student,
                attributes: ['id', 'name', 'currentClass', 'section', 'referenceNo']
            }],
            order: [['year', 'DESC'], ['month', 'DESC'], ['createdAt', 'DESC']]
        });

        // Group by Month and Year
        const grouped = {};
        feeLogs.forEach(log => {
            const key = `${log.month}-${log.year}`;
            if (!grouped[key]) {
                grouped[key] = {
                    month: log.month,
                    year: log.year,
                    totalAmount: 0,
                    totalPaid: 0,
                    vouchers: []
                };
            }
            grouped[key].vouchers.push(log);
            grouped[key].totalAmount += parseFloat(log.amount);
            grouped[key].totalPaid += parseFloat(log.paidAmount || 0);
        });

        const groupedArray = Object.values(grouped).sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });

        // Calculate total collective balance
        const allPendingLogs = await FeeLog.findAll({
            where: {
                familyId,
                status: { [Op.in]: ['PENDING', 'PARTIAL'] }
            }
        });

        const totalBalance = allPendingLogs.reduce((acc, log) => {
            return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount || 0));
        }, 0);

        res.status(200).json({
            success: true,
            data: {
                history: groupedArray,
                totalBalance
            }
        });
    } catch (error) {
        console.error('Error fetching family fees:', error);
        res.status(500).json({ success: false, message: 'Error fetching family fees.' });
    }
};

exports.generateFamilyVouchers = async (req, res) => {
    try {
        const { familyId, month, year } = req.body;

        const students = await Student.findAll({
            where: { familyId, status: 'ACTIVE' }
        });

        if (students.length === 0) {
            return res.status(400).json({ success: false, message: 'No active students found in this family.' });
        }

        const results = {
            generated: [],
            skipped: []
        };

        for (const student of students) {
            // Check if voucher already exists
            const existing = await FeeLog.findOne({
                where: { studentId: student.id, month, year }
            });

            if (existing) {
                results.skipped.push({ studentId: student.id, name: student.name, reason: 'Already exists' });
                continue;
            }

            const monthlyFee = parseFloat(student.monthlyFee || 0);
            const academyFee = parseFloat(student.academyFee || 0);
            const labMiscFee = parseFloat(student.labMiscFee || 0);
            const totalAmount = monthlyFee + academyFee + labMiscFee;

            if (totalAmount > 0) {
                const voucher = await FeeLog.create({
                    familyId,
                    studentId: student.id,
                    month,
                    year,
                    monthlyFee,
                    academyFee,
                    labMiscFee,
                    amount: totalAmount,
                    paidAmount: 0,
                    status: 'PENDING',
                    type: 'monthly_voucher',
                    description: `Monthly Fee Voucher for ${month}/${year}`
                });
                results.generated.push(voucher);
            } else {
                results.skipped.push({ studentId: student.id, name: student.name, reason: 'No fees assigned' });
            }
        }

        res.status(201).json({
            success: true,
            message: `Processed vouchers: ${results.generated.length} generated, ${results.skipped.length} skipped.`,
            data: results
        });
    } catch (error) {
        console.error('Error generating family vouchers:', error);
        res.status(500).json({ success: false, message: 'Error generating family vouchers.' });
    }
};

exports.bulkGenerateVouchers = async (req, res) => {
    try {
        const { branchId, currentClass, month, year } = req.body;

        if (!branchId || !month || !year) {
            return res.status(400).json({ success: false, message: 'Branch, month, and year are required.' });
        }

        const whereClause = { branchId, status: 'ACTIVE' };
        if (currentClass) {
            whereClause.currentClass = currentClass;
        }

        const students = await Student.findAll({ where: whereClause });

        if (students.length === 0) {
            return res.status(400).json({ success: false, message: 'No active students found for the selected criteria.' });
        }

        const results = { generated: 0, skipped: 0 };

        for (const student of students) {
            const existing = await FeeLog.findOne({
                where: { studentId: student.id, month, year }
            });

            if (existing) {
                results.skipped++;
                continue;
            }

            const monthlyFee = parseFloat(student.monthlyFee || 0);
            const academyFee = parseFloat(student.academyFee || 0);
            const labMiscFee = parseFloat(student.labMiscFee || 0);
            const totalAmount = monthlyFee + academyFee + labMiscFee;

            if (totalAmount > 0) {
                await FeeLog.create({
                    familyId: student.familyId,
                    studentId: student.id,
                    month,
                    year,
                    monthlyFee,
                    academyFee,
                    labMiscFee,
                    amount: totalAmount,
                    paidAmount: 0,
                    status: 'PENDING',
                    type: 'monthly_voucher',
                    description: `Monthly Fee Voucher for ${month}/${year}`
                });
                results.generated++;
            } else {
                results.skipped++;
            }
        }

        res.status(201).json({
            success: true,
            message: `Vouchers processed: ${results.generated} generated, ${results.skipped} skipped.`,
            data: results
        });
    } catch (error) {
        console.error('Error in bulk generation:', error);
        res.status(500).json({ success: false, message: 'Error in bulk voucher generation.' });
    }
};

exports.getBulkFees = async (req, res) => {
    try {
        const { branchId, currentClass, month, year } = req.query;

        if (!branchId || !month || !year) {
            return res.status(400).json({ success: false, message: 'Branch, month, and year are required.' });
        }

        const whereClause = { month, year };
        const studentWhere = { branchId };
        if (currentClass) {
            studentWhere.currentClass = currentClass;
        }

        const feeLogs = await FeeLog.findAll({
            where: whereClause,
            include: [
                {
                    model: Student,
                    where: studentWhere,
                    attributes: ['id', 'name', 'currentClass', 'section', 'admissionNo', 'referenceNo']
                },
                {
                    model: Family,
                    attributes: ['id', 'fatherName', 'fatherPhone']
                }
            ],
            order: [[Student, 'name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: feeLogs
        });
    } catch (error) {
        console.error('Error fetching bulk fees:', error);
        res.status(500).json({ success: false, message: 'Error fetching vouchers.' });
    }
};

exports.getPendingFeesReport = async (req, res) => {
    try {
        const { branchId, currentClass, month, year, minBalance } = req.query;

        const studentWhere = { status: 'ACTIVE' };
        if (branchId) {
            studentWhere.branchId = branchId;
        }
        if (currentClass) {
            studentWhere.currentClass = currentClass;
        }

        const feeLogWhere = { status: { [Op.in]: ['PENDING', 'PARTIAL'] } };
        if (month) feeLogWhere.month = month;
        if (year) feeLogWhere.year = year;

        const students = await Student.findAll({
            where: studentWhere,
            include: [
                {
                    model: Family,
                    attributes: ['id', 'fatherName', 'fatherPhone']
                },
                {
                    model: Branch,
                    attributes: ['id', 'name']
                },
                {
                    model: FeeLog,
                    where: feeLogWhere,
                    required: true // We only want students who have pending logs matching criteria
                }
            ]
        });

        const report = students.map(student => {
            const pendingLogs = student.FeeLogs || [];
            const outstandingBalance = pendingLogs.reduce((acc, log) => {
                return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount || 0));
            }, 0);

            return {
                id: student.id,
                name: student.name,
                admissionNo: student.admissionNo,
                currentClass: student.currentClass,
                section: student.section,
                branch: student.Branch?.name,
                fatherName: student.Family?.fatherName,
                fatherPhone: student.Family?.fatherPhone,
                pendingVouchers: pendingLogs.length,
                outstandingBalance
            };
        });

        // Filter by minBalance if provided
        let filteredReport = report;
        if (minBalance) {
            const min = parseFloat(minBalance);
            filteredReport = report.filter(item => item.outstandingBalance >= min);
        }

        // Sort by balance descending
        filteredReport.sort((a, b) => b.outstandingBalance - a.outstandingBalance);

        res.status(200).json({
            success: true,
            data: filteredReport
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: 'Error generating pending fees report.' });
    }
};
