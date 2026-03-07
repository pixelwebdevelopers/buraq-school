const { Student, Branch, User } = require('../models');

const dashboardController = {
    getStats: async (req, res, next) => {
        try {
            const role = req.user.role;
            const branchId = req.user.branchId;

            const stats = {
                totalStudents: 0,
                totalStaff: 0,
                totalBranches: 0,
            };

            if (role === 'ADMIN') {
                stats.totalBranches = await Branch.count();
                stats.totalStudents = await Student.count();
                stats.totalStaff = await User.count({ where: { role: 'STAFF' } });
                stats.totalPrincipals = await User.count({ where: { role: 'PRINCIPAL' } });
            } else {
                // PRINCIPAL or STAFF
                stats.totalStudents = await Student.count({ where: { branchId } });
                stats.totalStaff = await User.count({ where: { branchId, role: 'STAFF' } });
            }

            res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = dashboardController;
