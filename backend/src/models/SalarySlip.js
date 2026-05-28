module.exports = (sequelize, DataTypes) => {
    const SalarySlip = sequelize.define('SalarySlip', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        staffId: { type: DataTypes.INTEGER, allowNull: false },
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        month: { type: DataTypes.INTEGER, allowNull: false }, // 1-12
        year: { type: DataTypes.INTEGER, allowNull: false },
        monthDays: { type: DataTypes.INTEGER, allowNull: false }, // total days in month
        existingDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        baseSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        calculatedSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        // allowances/deductions stored as JSON arrays of { name, amount } items (max 5 each)
        allowances: { type: DataTypes.TEXT, allowNull: true },
        deductions: { type: DataTypes.TEXT, allowNull: true },
        allowanceTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        deductionTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        payableSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        medicalLeavesSnapshot: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        professionSnapshot: { type: DataTypes.STRING(100) },
        nameSnapshot: { type: DataTypes.STRING(150) },
        notes: { type: DataTypes.TEXT },
        createdById: { type: DataTypes.INTEGER }
    }, {
        tableName: 'salary_slips',
        timestamps: true,
        indexes: [
            { unique: true, fields: ['staffId', 'month', 'year'] }
        ]
    });

    SalarySlip.associate = (models) => {
        SalarySlip.belongsTo(models.Staff, { foreignKey: 'staffId' });
        SalarySlip.belongsTo(models.Branch, { foreignKey: 'branchId' });
        SalarySlip.belongsTo(models.User, { as: 'createdBy', foreignKey: 'createdById' });
    };

    return SalarySlip;
};
