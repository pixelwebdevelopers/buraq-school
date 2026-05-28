const { Staff, SalarySlip, AdditionalExpense, Branch, sequelize } = require('../models');
const { Op } = require('sequelize');

// Utilities
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function parseJsonArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try { return JSON.parse(value); } catch (e) { return []; }
}

function sanitizeItems(items) {
    if (!Array.isArray(items)) return [];
    return items
        .filter(it => it && (it.name || it.amount))
        .slice(0, 5)
        .map(it => ({
            name: String(it.name || '').slice(0, 100),
            amount: Number(it.amount) || 0
        }));
}

function computeSalary({ baseSalary, monthDays, existingDays, allowances, deductions }) {
    const base = Number(baseSalary) || 0;
    const md = Math.max(1, parseInt(monthDays) || 30);
    const ed = Math.max(0, Math.min(md, parseInt(existingDays) || 0));
    const absences = md - ed;
    // 1 leave allowed without deduction
    const billableAbsences = Math.max(0, absences - 1);
    const perDay = base / md;
    const calculatedSalary = Math.max(0, base - perDay * billableAbsences);

    const allowanceTotal = (allowances || []).reduce((s, a) => s + (Number(a.amount) || 0), 0);
    const deductionTotal = (deductions || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const payableSalary = Math.max(0, calculatedSalary + allowanceTotal - deductionTotal);

    return {
        calculatedSalary: Math.round(calculatedSalary * 100) / 100,
        allowanceTotal: Math.round(allowanceTotal * 100) / 100,
        deductionTotal: Math.round(deductionTotal * 100) / 100,
        payableSalary: Math.round(payableSalary * 100) / 100
    };
}

function resolveBranchScope(req) {
    if (req.user.role === 'ADMIN') {
        return req.query.branchId ? parseInt(req.query.branchId) : null;
    }
    return req.user.branchId;
}

const salaryController = {
    // GET /api/salaries/sheet?branchId=&month=&year=
    // Returns the monthly salary sheet for a branch: staff list, existing slips, expenses, and meta
    getMonthlySheet: async (req, res, next) => {
        try {
            const month = parseInt(req.query.month);
            const year = parseInt(req.query.year);
            if (!month || !year || month < 1 || month > 12) {
                const err = new Error('Valid month (1-12) and year are required.');
                err.statusCode = 400;
                throw err;
            }

            let branchId = resolveBranchScope(req);
            if (req.user.role === 'ADMIN' && !branchId) {
                const err = new Error('branchId is required for Admins.');
                err.statusCode = 400;
                throw err;
            }

            const staffList = await Staff.findAll({
                where: { branchId, status: 'ACTIVE' },
                order: [['name', 'ASC']]
            });

            const slips = await SalarySlip.findAll({
                where: { branchId, month, year }
            });

            const expenses = await AdditionalExpense.findAll({
                where: { branchId, month, year },
                order: [['createdAt', 'ASC']]
            });

            const branch = await Branch.findByPk(branchId);

            const slipsById = {};
            slips.forEach(s => {
                slipsById[s.staffId] = {
                    ...s.toJSON(),
                    allowances: parseJsonArray(s.allowances),
                    deductions: parseJsonArray(s.deductions)
                };
            });

            res.status(200).json({
                success: true,
                data: {
                    branch: branch ? { id: branch.id, name: branch.name } : null,
                    month,
                    year,
                    monthDays: daysInMonth(month, year),
                    staff: staffList,
                    slipsByStaffId: slipsById,
                    expenses
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/salaries/slips — create or upsert a slip
    upsertSlip: async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const {
                staffId, month, year, existingDays,
                allowances, deductions, notes
            } = req.body;

            if (!staffId || !month || !year) {
                const err = new Error('staffId, month, and year are required.');
                err.statusCode = 400;
                throw err;
            }

            const staff = await Staff.findByPk(staffId, { transaction: t });
            if (!staff) {
                const err = new Error('Staff not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && staff.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized for this staff member');
                err.statusCode = 403;
                throw err;
            }

            const md = daysInMonth(month, year);
            const cleanAllowances = sanitizeItems(allowances);
            const cleanDeductions = sanitizeItems(deductions);
            const computed = computeSalary({
                baseSalary: staff.baseSalary,
                monthDays: md,
                existingDays,
                allowances: cleanAllowances,
                deductions: cleanDeductions
            });

            const existing = await SalarySlip.findOne({
                where: { staffId, month, year },
                transaction: t
            });

            const payload = {
                staffId,
                branchId: staff.branchId,
                month,
                year,
                monthDays: md,
                existingDays: Math.max(0, Math.min(md, parseInt(existingDays) || 0)),
                baseSalary: staff.baseSalary,
                calculatedSalary: computed.calculatedSalary,
                allowances: JSON.stringify(cleanAllowances),
                deductions: JSON.stringify(cleanDeductions),
                allowanceTotal: computed.allowanceTotal,
                deductionTotal: computed.deductionTotal,
                payableSalary: computed.payableSalary,
                medicalLeavesSnapshot: staff.medicalLeaves,
                professionSnapshot: staff.profession,
                nameSnapshot: staff.name,
                notes: notes || null,
                createdById: req.user.id
            };

            let slip;
            if (existing) {
                await existing.update(payload, { transaction: t });
                slip = existing;
            } else {
                slip = await SalarySlip.create(payload, { transaction: t });
            }

            await t.commit();

            res.status(200).json({
                success: true,
                message: 'Salary slip saved',
                data: {
                    ...slip.toJSON(),
                    allowances: cleanAllowances,
                    deductions: cleanDeductions
                }
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    },

    // DELETE /api/salaries/slips/:id
    deleteSlip: async (req, res, next) => {
        try {
            const slip = await SalarySlip.findByPk(req.params.id);
            if (!slip) {
                const err = new Error('Slip not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && slip.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized');
                err.statusCode = 403;
                throw err;
            }
            await slip.destroy();
            res.status(200).json({ success: true, message: 'Slip deleted' });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/salaries/slips/history?staffId=&limit=
    getStaffSlipHistory: async (req, res, next) => {
        try {
            const { staffId } = req.query;
            if (!staffId) {
                const err = new Error('staffId is required');
                err.statusCode = 400;
                throw err;
            }
            const staff = await Staff.findByPk(staffId);
            if (!staff) {
                const err = new Error('Staff not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && staff.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized');
                err.statusCode = 403;
                throw err;
            }
            const slips = await SalarySlip.findAll({
                where: { staffId },
                order: [['year', 'DESC'], ['month', 'DESC']]
            });
            res.status(200).json({
                success: true,
                data: slips.map(s => ({
                    ...s.toJSON(),
                    allowances: parseJsonArray(s.allowances),
                    deductions: parseJsonArray(s.deductions)
                }))
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/salaries/expenses — add additional expense
    addExpense: async (req, res, next) => {
        try {
            const { name, amount, month, year, notes, branchId } = req.body;
            if (!name || amount === undefined || !month || !year) {
                const err = new Error('name, amount, month and year are required.');
                err.statusCode = 400;
                throw err;
            }

            let targetBranchId = req.user.branchId;
            if (req.user.role === 'ADMIN') {
                if (!branchId) {
                    const err = new Error('branchId is required for Admins.');
                    err.statusCode = 400;
                    throw err;
                }
                targetBranchId = branchId;
            }

            const expense = await AdditionalExpense.create({
                branchId: targetBranchId,
                month, year, name,
                amount: Number(amount) || 0,
                notes: notes || null,
                createdById: req.user.id
            });

            res.status(201).json({ success: true, message: 'Expense added', data: expense });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/salaries/expenses/:id
    updateExpense: async (req, res, next) => {
        try {
            const expense = await AdditionalExpense.findByPk(req.params.id);
            if (!expense) {
                const err = new Error('Expense not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && expense.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized');
                err.statusCode = 403;
                throw err;
            }
            const { name, amount, notes } = req.body;
            await expense.update({
                name: name !== undefined ? name : expense.name,
                amount: amount !== undefined ? Number(amount) || 0 : expense.amount,
                notes: notes !== undefined ? notes : expense.notes
            });
            res.status(200).json({ success: true, message: 'Expense updated', data: expense });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/salaries/expenses/:id
    deleteExpense: async (req, res, next) => {
        try {
            const expense = await AdditionalExpense.findByPk(req.params.id);
            if (!expense) {
                const err = new Error('Expense not found');
                err.statusCode = 404;
                throw err;
            }
            if (req.user.role !== 'ADMIN' && expense.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized');
                err.statusCode = 403;
                throw err;
            }
            await expense.destroy();
            res.status(200).json({ success: true, message: 'Expense deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = salaryController;
