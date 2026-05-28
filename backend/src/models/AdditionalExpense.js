module.exports = (sequelize, DataTypes) => {
    const AdditionalExpense = sequelize.define('AdditionalExpense', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        month: { type: DataTypes.INTEGER, allowNull: false }, // 1-12
        year: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING(150), allowNull: false },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        notes: { type: DataTypes.TEXT },
        createdById: { type: DataTypes.INTEGER }
    }, {
        tableName: 'additional_expenses',
        timestamps: true
    });

    AdditionalExpense.associate = (models) => {
        AdditionalExpense.belongsTo(models.Branch, { foreignKey: 'branchId' });
        AdditionalExpense.belongsTo(models.User, { as: 'createdBy', foreignKey: 'createdById' });
    };

    return AdditionalExpense;
};
