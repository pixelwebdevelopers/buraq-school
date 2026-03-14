module.exports = (sequelize, DataTypes) => {
    const FeeLog = sequelize.define('FeeLog', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        familyId: { type: DataTypes.INTEGER, allowNull: false },
        studentId: { type: DataTypes.INTEGER },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false }, // Will act as totalAmount
        month: { type: DataTypes.INTEGER, allowNull: true },
        year: { type: DataTypes.INTEGER, allowNull: true },
        monthlyFee: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        academyFee: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        labMiscFee: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        extraChargeName: { type: DataTypes.STRING(255), allowNull: true },
        extraChargeAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        paidAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
        status: { type: DataTypes.STRING(30), defaultValue: 'PENDING' },
        type: { type: DataTypes.STRING(30), allowNull: false },
        description: { type: DataTypes.STRING(255) },
        billedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'fee_logs',
        timestamps: false
    });

    FeeLog.associate = (models) => {
        FeeLog.belongsTo(models.Family, { foreignKey: 'familyId' });
        FeeLog.belongsTo(models.Student, { foreignKey: 'studentId' });
    };

    return FeeLog;
};
