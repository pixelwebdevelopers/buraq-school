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

        // Branch-scoping for STAFF/PRINCIPAL
        if (req.user.role !== 'ADMIN' && student.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Access denied: Student belongs to another branch.' });
        }

        const { count, rows: currentLogs } = await FeeLog.findAndCountAll({
            where: { studentId },
            order: [['year', 'DESC'], ['month', 'DESC'], ['createdAt', 'DESC']],
            limit,
            offset
        });

        // Fetch ALL pending logs to calculate total balance and previous balances
        const allPendingLogs = await FeeLog.findAll({
            where: {
                studentId,
                status: { [Op.in]: ['PENDING', 'PARTIAL'] }
            },
            order: [['year', 'ASC'], ['month', 'ASC']]
        });

        const totalBalance = allPendingLogs.reduce((acc, log) => {
            return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount || 0));
        }, 0);

        // Enhance rows with previousBalance
        const enhancedRows = currentLogs.map(log => {
            const l = log.toJSON();
            // previous balance is the sum of all pending logs that are OLDER than the current log's month/year
            const prevBalance = allPendingLogs.filter(p => {
                if (p.year < l.year) return true;
                if (p.year === l.year && p.month < l.month) return true;
                return false;
            }).reduce((acc, p) => acc + (parseFloat(p.amount) - parseFloat(p.paidAmount || 0)), 0);
            
            l.previousBalance = prevBalance;
            return l;
        });

        res.status(200).json({
            success: true,
            data: {
                vouchers: enhancedRows,
                totalBalance,
                totalCount: count,
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
        const { studentId, month, year, extraChargeName, extraChargeAmount } = req.body;

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        // Branch-scoping for STAFF/PRINCIPAL
        if (req.user.role !== 'ADMIN' && student.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Access denied: Student belongs to another branch.' });
        }

        // Only generate for active students
        if (student.status !== 'ACTIVE') {
            return res.status(400).json({ success: false, message: `Cannot generate voucher for student: student is currently ${student.status}.` });
        }

        // Check if voucher already exists for this month/year
        const existingLog = await FeeLog.findOne({
            where: { studentId, month, year }
        });

        if (existingLog) {
            return res.status(400).json({ success: false, message: `Voucher already exists for ${month}/${year}.` });
        }

        // Calculate total amount based on student's current assigned fees + extras
        const monthlyFee = parseFloat(student.monthlyFee || 0);
        const academyFee = parseFloat(student.academyFee || 0);
        const labMiscFee = parseFloat(student.labMiscFee || 0);
        const extraAmount = parseFloat(extraChargeAmount || 0);
        const totalAmount = monthlyFee + academyFee + labMiscFee + extraAmount;

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
            extraChargeName,
            extraChargeAmount: extraAmount,
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

        const voucher = await FeeLog.findByPk(id, {
            include: [{ model: Student, attributes: ['branchId'] }]
        });
        if (!voucher) {
            return res.status(404).json({ success: false, message: 'Voucher not found.' });
        }

        // Branch-scoping for STAFF/PRINCIPAL
        if (req.user.role !== 'ADMIN' && voucher.Student?.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Access denied: Voucher belongs to another branch.' });
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

        // Branch-scoping for STAFF/PRINCIPAL
        if (req.user.role !== 'ADMIN' && family.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Access denied: Family belongs to another branch.' });
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

        // Fetch ALL pending logs to calculate total balance and previous balances
        const allPendingLogs = await FeeLog.findAll({
            where: {
                familyId,
                status: { [Op.in]: ['PENDING', 'PARTIAL'] }
            },
            order: [['year', 'ASC'], ['month', 'ASC']]
        });

        const totalBalance = allPendingLogs.reduce((acc, log) => {
            return acc + (parseFloat(log.amount) - parseFloat(log.paidAmount || 0));
        }, 0);

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

        // Enhance grouped records with previousBalance
        const enhancedGroupedArray = groupedArray.map(group => {
            // previous balance is the sum of all pending logs that are OLDER than the current group's month/year
            const prevBalance = allPendingLogs.filter(p => {
                if (p.year < group.year) return true;
                if (p.year === group.year && p.month < group.month) return true;
                return false;
            }).reduce((acc, p) => acc + (parseFloat(p.amount) - parseFloat(p.paidAmount || 0)), 0);
            
            return {
                ...group,
                previousBalance: prevBalance
            };
        });

        // Pagination for Grouped Data
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedHistory = enhancedGroupedArray.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: {
                history: paginatedHistory,
                totalBalance,
                pagination: {
                    totalCount: enhancedGroupedArray.length,
                    totalPages: Math.ceil(enhancedGroupedArray.length / limit),
                    currentPage: page,
                    limit
                }
            }
        });
    } catch (error) {
        console.error('Error fetching family fees:', error);
        res.status(500).json({ success: false, message: 'Error fetching family fees.' });
    }
};

exports.generateFamilyVouchers = async (req, res) => {
    try {
        const { familyId, month, year, extraChargeName, extraChargeAmount } = req.body;

        const family = await Family.findByPk(familyId);
        if (!family) {
            return res.status(404).json({ success: false, message: 'Family not found.' });
        }

        // Branch-scoping for STAFF/PRINCIPAL
        if (req.user.role !== 'ADMIN' && family.branchId !== req.user.branchId) {
            return res.status(403).json({ success: false, message: 'Access denied: Family belongs to another branch.' });
        }

        const students = await Student.findAll({
            where: { familyId, status: 'ACTIVE' }
        });

        const results = {
            generated: [],
            skipped: []
        };

        const extraAmount = parseFloat(extraChargeAmount || 0);

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
            
            // Distribute extra charge evenly OR just add to the first student? 
            // Usually, family-level extra charges are for the whole family.
            // Let's add it only if it's the first student in the loop to avoid duplication.
            let applyExtra = 0;
            if (results.generated.length === 0) {
                applyExtra = extraAmount;
            }

            const totalAmount = monthlyFee + academyFee + labMiscFee + applyExtra;

            if (totalAmount > 0) {
                const voucher = await FeeLog.create({
                    familyId,
                    studentId: student.id,
                    month,
                    year,
                    monthlyFee,
                    academyFee,
                    labMiscFee,
                    extraChargeName: applyExtra > 0 ? extraChargeName : null,
                    extraChargeAmount: applyExtra,
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
        let { branchId, currentClass, month, year, extraChargeName, extraChargeAmount } = req.body;

        // Force branch scoping for non-admins
        if (req.user.role !== 'ADMIN') {
            branchId = req.user.branchId;
        }

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
        const extraAmount = parseFloat(extraChargeAmount || 0);

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
            const totalAmount = monthlyFee + academyFee + labMiscFee + extraAmount;

            if (totalAmount > 0) {
                await FeeLog.create({
                    familyId: student.familyId,
                    studentId: student.id,
                    month,
                    year,
                    monthlyFee,
                    academyFee,
                    labMiscFee,
                    extraChargeName,
                    extraChargeAmount: extraAmount,
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

// --- NEW COLLECTION & DISCOUNT LOGIC ---

exports.collectBulkPayment = async (req, res) => {
    try {
        const { familyId, studentId, amount } = req.body;
        let totalReceived = parseFloat(amount);

        if (isNaN(totalReceived) || totalReceived <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
        }

        const whereClause = { status: { [Op.in]: ['PENDING', 'PARTIAL'] } };
        if (familyId) whereClause.familyId = familyId;
        if (studentId) whereClause.studentId = studentId;

        // Fetch logs by oldest first
        const pendingLogs = await FeeLog.findAll({
            where: whereClause,
            order: [['year', 'ASC'], ['month', 'ASC'], ['createdAt', 'ASC']]
        });

        if (pendingLogs.length === 0) {
            return res.status(400).json({ success: false, message: 'No pending vouchers found.' });
        }

        const updatedVouchers = [];

        for (const log of pendingLogs) {
            if (totalReceived <= 0) break;

            const remaining = parseFloat(log.amount) - parseFloat(log.paidAmount || 0);
            const paymentToApply = Math.min(totalReceived, remaining);

            const newPaidAmount = parseFloat(log.paidAmount || 0) + paymentToApply;
            log.paidAmount = newPaidAmount;
            log.status = (newPaidAmount >= parseFloat(log.amount)) ? 'PAID' : 'PARTIAL';
            
            await log.save();
            updatedVouchers.push(log);
            totalReceived -= paymentToApply;
        }

        res.status(200).json({
            success: true,
            message: `Payment collected. Total amount applied across ${updatedVouchers.length} vouchers.`,
            data: { updatedCount: updatedVouchers.length }
        });
    } catch (error) {
        console.error('Error in collectBulkPayment:', error);
        res.status(500).json({ success: false, message: 'Error collecting payment.' });
    }
};

exports.applyBulkDiscount = async (req, res) => {
    try {
        const { familyId, studentId, amount } = req.body;
        let discountToApply = parseFloat(amount);

        if (isNaN(discountToApply) || discountToApply <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid discount amount.' });
        }

        const whereClause = { status: { [Op.in]: ['PENDING', 'PARTIAL'] } };
        if (familyId) whereClause.familyId = familyId;
        if (studentId) whereClause.studentId = studentId;

        // Fetch logs by oldest first
        const pendingLogs = await FeeLog.findAll({
            where: whereClause,
            order: [['year', 'ASC'], ['month', 'ASC'], ['createdAt', 'ASC']]
        });

        if (pendingLogs.length === 0) {
            return res.status(400).json({ success: false, message: 'No pending vouchers found to discount.' });
        }

        const updatedVouchers = [];

        for (const log of pendingLogs) {
            if (discountToApply <= 0) break;

            const currentRemaining = parseFloat(log.amount) - parseFloat(log.paidAmount || 0);
            const reduction = Math.min(discountToApply, currentRemaining);

            // Reduce the total billed amount
            const newTotalAmount = parseFloat(log.amount) - reduction;
            log.amount = newTotalAmount;
            
            // Re-calculate status if paidAmount now equals or exceeds new amount
            if (parseFloat(log.paidAmount || 0) >= newTotalAmount && newTotalAmount > 0) {
                log.status = 'PAID';
            } else if (newTotalAmount === 0) {
                log.status = 'PAID';
            }

            await log.save();
            updatedVouchers.push(log);
            discountToApply -= reduction;
        }

        res.status(200).json({
            success: true,
            message: `Discount applied. Total reduction distributed across ${updatedVouchers.length} vouchers.`,
            data: { updatedCount: updatedVouchers.length }
        });
    } catch (error) {
        console.error('Error in applyBulkDiscount:', error);
        res.status(500).json({ success: false, message: 'Error applying discount.' });
    }
};

exports.getBulkFees = async (req, res) => {
    try {
        let { branchId, currentClass, month, year } = req.query;

        // Force branch scoping for non-admins
        if (req.user.role !== 'ADMIN') {
            branchId = req.user.branchId;
        }

        if (!branchId || !month || !year) {
            return res.status(400).json({ success: false, message: 'Branch, month, and year are required.' });
        }

        const whereClause = { month, year };
        const studentWhere = { branchId };
        if (currentClass) {
            studentWhere.currentClass = currentClass;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: feeLogs } = await FeeLog.findAndCountAll({
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
            limit,
            offset,
            order: [[Student, 'name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: feeLogs,
            pagination: {
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching bulk fees:', error);
        res.status(500).json({ success: false, message: 'Error fetching vouchers.' });
    }
};

exports.getPendingFeesReport = async (req, res) => {
    try {
        let { branchId, currentClass, month, year, minBalance } = req.query;

        // Force branch scoping for non-admins
        if (req.user.role !== 'ADMIN') {
            branchId = req.user.branchId;
        }

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
                    required: true
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

        // Calculate Grand Totals (BEFORE pagination)
        const grandTotalBalance = filteredReport.reduce((acc, item) => acc + item.outstandingBalance, 0);
        const grandTotalStudents = filteredReport.length;

        // Sort by balance descending
        filteredReport.sort((a, b) => b.outstandingBalance - a.outstandingBalance);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedData = filteredReport.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: paginatedData,
            summary: {
                totalBalance: grandTotalBalance,
                totalStudents: grandTotalStudents
            },
            pagination: {
                totalCount: grandTotalStudents,
                totalPages: Math.ceil(grandTotalStudents / limit),
                currentPage: page,
                limit
            },
            fullCount: grandTotalStudents
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: 'Error generating pending fees report.' });
    }
};

const getClassPriority = (className) => {
    if (!className) return 0;
    const c = className.toLowerCase().replace(/\s/g, '');
    if (c === 'playgroup') return 1;
    if (c === 'nursery') return 2;
    if (c === 'prep') return 3;
    if (c === 'firstyear') return 14;
    if (c === 'secondyear') return 15;
    
    const numMatch = c.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0]) + 3; // Class 1 becomes 4, etc.
    return 0;
};

exports.getBulkFamilyFees = async (req, res) => {
    try {
        let { branchId, currentClass, month, year } = req.query;

        // Force branch scoping for non-admins
        if (req.user.role !== 'ADMIN') {
            branchId = req.user.branchId;
        }

        if (!branchId || !month || !year) {
            return res.status(400).json({ success: false, message: 'Branch, month, and year are required.' });
        }

        const studentWhere = { branchId, status: 'ACTIVE' };
        if (currentClass) {
            studentWhere.currentClass = currentClass;
        }

        // 1. Get all students matches the filter (e.g. Class 5 students)
        const targetStudents = await Student.findAll({
            where: studentWhere,
            include: [{ model: Family, attributes: ['id', 'fatherName', 'fatherPhone'] }]
        });

        if (targetStudents.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const familiesToProcess = [];
        const seenFamilyIds = new Set();

        for (const student of targetStudents) {
            if (seenFamilyIds.has(student.familyId)) continue;
            seenFamilyIds.add(student.familyId);

            // 2. For each family, find ALL siblings in the same branch
            const siblings = await Student.findAll({
                where: { familyId: student.familyId, branchId, status: 'ACTIVE' }
            });

            // 3. Sort siblings by class priority (descending: highest class first)
            // If classes are equal, sort by ID or Name as a tie-breaker (to ensure only one sibling gets selected)
            const sortedSiblings = siblings.sort((a, b) => {
                const pA = getClassPriority(a.currentClass);
                const pB = getClassPriority(b.currentClass);
                if (pB !== pA) return pB - pA;
                return b.id - a.id; // Secondary sort by ID for consistency
            });

            const representativeSibling = sortedSiblings[0];

            // 4. IMPORTANT: Only include this family if the representative sibling's class matches the current filter
            // This prevents duplicate printing across different classes
            if (currentClass && representativeSibling.currentClass !== currentClass) {
                continue;
            }

            // 5. Ensure all siblings have a voucher for this month/year
            const vouchers = [];
            let collectiveAmount = 0;
            let collectivePaid = 0;

            for (const sib of sortedSiblings) {
                let voucher = await FeeLog.findOne({
                    where: { studentId: sib.id, month, year }
                });

                if (!voucher) {
                    // Generate missing voucher automatically for the family print
                    const monthlyFee = parseFloat(sib.monthlyFee || 0);
                    const academyFee = parseFloat(sib.academyFee || 0);
                    const labMiscFee = parseFloat(sib.labMiscFee || 0);
                    const totalAmount = monthlyFee + academyFee + labMiscFee;

                    if (totalAmount > 0) {
                        voucher = await FeeLog.create({
                            familyId: sib.familyId,
                            studentId: sib.id,
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
                    }
                }

                if (voucher) {
                    vouchers.push(voucher);
                    collectiveAmount += parseFloat(voucher.amount);
                    collectivePaid += parseFloat(voucher.paidAmount || 0);
                }
            }

            // 6. Calculate collective previous balance
            const allPendingLogs = await FeeLog.findAll({
                where: {
                    familyId: student.familyId,
                    status: { [Op.in]: ['PENDING', 'PARTIAL'] }
                }
            });

            const collectivePrevBalance = allPendingLogs.filter(p => {
                if (parseInt(p.year) < parseInt(year)) return true;
                if (parseInt(p.year) === parseInt(year) && parseInt(p.month) < parseInt(month)) return true;
                return false;
            }).reduce((acc, p) => acc + (parseFloat(p.amount) - parseFloat(p.paidAmount || 0)), 0);

            familiesToProcess.push({
                family: student.Family,
                students: sortedSiblings,
                group: {
                    month,
                    year,
                    totalAmount: collectiveAmount,
                    totalPaid: collectivePaid,
                    previousBalance: collectivePrevBalance,
                    vouchers
                }
            });
        }

        res.status(200).json({
            success: true,
            data: familiesToProcess
        });
    } catch (error) {
        console.error('Error in getBulkFamilyFees:', error);
        res.status(500).json({ success: false, message: 'Error fetching bulk family vouchers.' });
    }
};

exports.deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await FeeLog.findByPk(id, {
            include: [{ model: Student }]
        });

        if (!voucher) {
            return res.status(404).json({ success: false, message: 'Voucher not found.' });
        }

        // Branch scoping check for PRINCIPAL
        if (req.user.role === 'PRINCIPAL') {
            if (voucher.Student?.branchId !== req.user.branchId) {
                return res.status(403).json({ success: false, message: 'Access denied to this student\'s branch fees.' });
            }
        } else if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete vouchers.' });
        }

        // Safety check: Don't delete if payment has been made
        if (parseFloat(voucher.paidAmount || 0) > 0 || voucher.status === 'PAID' || voucher.status === 'PARTIAL') {
            return res.status(400).json({ success: false, message: 'Cannot delete a voucher that has payments associated with it. Please void payments first if necessary.' });
        }

        await voucher.destroy();

        res.status(200).json({ success: true, message: 'Voucher deleted successfully.' });
    } catch (error) {
        console.error('Error deleting voucher:', error);
        res.status(500).json({ success: false, message: 'Error deleting voucher.' });
    }
};
