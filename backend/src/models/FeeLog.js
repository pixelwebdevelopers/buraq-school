module.exports = (sequelize, DataTypes) => {
    const FeeLog = sequelize.define('FeeLog', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        familyId: { type: DataTypes.INTEGER, allowNull: false },
        studentId: { type: DataTypes.INTEGER },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
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
