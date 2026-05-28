const { FeeCollectionLog, SalarySlip, AdditionalExpense, Branch, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

function resolveBranchScope(req) {
    if (req.user.role === 'ADMIN') {
        return req.query.branchId ? parseInt(req.query.branchId) : null;
    }
    return req.user.branchId;
}

function emptyMonthMap(year) {
    const map = {};
    for (let m = 1; m <= 12; m++) {
        const key = `${year}-${String(m).padStart(2, '0')}`;
        map[key] = { period: key, label: monthLabel(m, year), month: m, year, revenue: 0, expenses: 0, salaries: 0, additionalExpenses: 0, net: 0 };
    }
    return map;
}

function monthLabel(m, y) {
    return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' }) + ' ' + y;
}

const analyticsController = {
    // GET /api/analytics/financial?branchId=&year=YYYY
    // Returns monthly + quarterly + yearly aggregates of revenue (fee collections) and expenses (salaries + additional)
    getFinancialOverview: async (req, res, next) => {
        try {
            const branchId = resolveBranchScope(req);
            const year = parseInt(req.query.year) || new Date().getFullYear();

            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year + 1, 0, 1);

            const branchWhere = branchId ? { branchId } : {};

            // Revenue from fee_collection_logs (createdAt within year)
            const revenueRows = await FeeCollectionLog.findAll({
                where: {
                    ...branchWhere,
                    createdAt: { [Op.gte]: startDate, [Op.lt]: endDate }
                },
                attributes: [
                    [fn('MONTH', col('createdAt')), 'm'],
                    [fn('SUM', col('amountPaid')), 'total']
                ],
                group: [literal('MONTH(createdAt)')],
                raw: true
            });

            // Salary expenses from salary_slips (by stored month/year)
            const salaryRows = await SalarySlip.findAll({
                where: { ...branchWhere, year },
                attributes: [
                    'month',
                    [fn('SUM', col('payableSalary')), 'total']
                ],
                group: ['month'],
                raw: true
            });

            // Additional expenses
            const expenseRows = await AdditionalExpense.findAll({
                where: { ...branchWhere, year },
                attributes: [
                    'month',
                    [fn('SUM', col('amount')), 'total']
                ],
                group: ['month'],
                raw: true
            });

            // Build monthly map
            const months = emptyMonthMap(year);
            revenueRows.forEach(r => {
                const m = parseInt(r.m);
                const key = `${year}-${String(m).padStart(2, '0')}`;
                if (months[key]) months[key].revenue = Number(r.total) || 0;
            });
            salaryRows.forEach(r => {
                const m = parseInt(r.month);
                const key = `${year}-${String(m).padStart(2, '0')}`;
                if (months[key]) months[key].salaries = Number(r.total) || 0;
            });
            expenseRows.forEach(r => {
                const m = parseInt(r.month);
                const key = `${year}-${String(m).padStart(2, '0')}`;
                if (months[key]) months[key].additionalExpenses = Number(r.total) || 0;
            });

            const monthly = Object.values(months).map(m => {
                m.expenses = m.salaries + m.additionalExpenses;
                m.net = m.revenue - m.expenses;
                return m;
            });

            // Quarterly
            const quarterly = [1, 2, 3, 4].map(q => {
                const startM = (q - 1) * 3 + 1;
                const slice = monthly.slice(startM - 1, startM + 2);
                const revenue = slice.reduce((s, x) => s + x.revenue, 0);
                const salaries = slice.reduce((s, x) => s + x.salaries, 0);
                const additionalExpenses = slice.reduce((s, x) => s + x.additionalExpenses, 0);
                const expenses = salaries + additionalExpenses;
                return {
                    period: `${year}-Q${q}`,
                    label: `Q${q} ${year}`,
                    quarter: q,
                    year,
                    revenue,
                    salaries,
                    additionalExpenses,
                    expenses,
                    net: revenue - expenses
                };
            });

            // Multi-year (last 5 yrs incl current)
            const yearsList = [];
            for (let y = year - 4; y <= year; y++) yearsList.push(y);

            const yearStart = new Date(yearsList[0], 0, 1);
            const yearEnd = new Date(year + 1, 0, 1);

            const yearlyRevenue = await FeeCollectionLog.findAll({
                where: { ...branchWhere, createdAt: { [Op.gte]: yearStart, [Op.lt]: yearEnd } },
                attributes: [
                    [fn('YEAR', col('createdAt')), 'y'],
                    [fn('SUM', col('amountPaid')), 'total']
                ],
                group: [literal('YEAR(createdAt)')],
                raw: true
            });

            const yearlySalaries = await SalarySlip.findAll({
                where: { ...branchWhere, year: { [Op.in]: yearsList } },
                attributes: ['year', [fn('SUM', col('payableSalary')), 'total']],
                group: ['year'],
                raw: true
            });

            const yearlyExpenses = await AdditionalExpense.findAll({
                where: { ...branchWhere, year: { [Op.in]: yearsList } },
                attributes: ['year', [fn('SUM', col('amount')), 'total']],
                group: ['year'],
                raw: true
            });

            const yearMap = {};
            yearsList.forEach(y => {
                yearMap[y] = {
                    period: String(y),
                    label: String(y),
                    year: y,
                    revenue: 0,
                    salaries: 0,
                    additionalExpenses: 0,
                    expenses: 0,
                    net: 0
                };
            });
            yearlyRevenue.forEach(r => { if (yearMap[r.y]) yearMap[r.y].revenue = Number(r.total) || 0; });
            yearlySalaries.forEach(r => { if (yearMap[r.year]) yearMap[r.year].salaries = Number(r.total) || 0; });
            yearlyExpenses.forEach(r => { if (yearMap[r.year]) yearMap[r.year].additionalExpenses = Number(r.total) || 0; });

            const yearly = Object.values(yearMap).map(y => {
                y.expenses = y.salaries + y.additionalExpenses;
                y.net = y.revenue - y.expenses;
                return y;
            });

            // Totals for current year + KPIs
            const totals = monthly.reduce((acc, m) => {
                acc.revenue += m.revenue;
                acc.salaries += m.salaries;
                acc.additionalExpenses += m.additionalExpenses;
                acc.expenses += m.expenses;
                return acc;
            }, { revenue: 0, salaries: 0, additionalExpenses: 0, expenses: 0 });
            totals.net = totals.revenue - totals.expenses;

            // Branch breakdown for ADMIN (when not filtered)
            let branchBreakdown = null;
            if (req.user.role === 'ADMIN' && !branchId) {
                const branches = await Branch.findAll();
                branchBreakdown = await Promise.all(branches.map(async b => {
                    const rev = await FeeCollectionLog.sum('amountPaid', {
                        where: { branchId: b.id, createdAt: { [Op.gte]: startDate, [Op.lt]: endDate } }
                    }) || 0;
                    const sal = await SalarySlip.sum('payableSalary', { where: { branchId: b.id, year } }) || 0;
                    const exp = await AdditionalExpense.sum('amount', { where: { branchId: b.id, year } }) || 0;
                    return {
                        id: b.id,
                        name: b.name,
                        revenue: Number(rev),
                        expenses: Number(sal) + Number(exp),
                        net: Number(rev) - (Number(sal) + Number(exp))
                    };
                }));
            }

            res.status(200).json({
                success: true,
                data: {
                    year,
                    branchId: branchId || null,
                    monthly,
                    quarterly,
                    yearly,
                    totals,
                    branchBreakdown
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = analyticsController;
