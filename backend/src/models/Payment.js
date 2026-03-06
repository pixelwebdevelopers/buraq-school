module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        familyId: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        method: { type: DataTypes.STRING(30) },
        remarks: { type: DataTypes.TEXT },
        receivedById: { type: DataTypes.INTEGER },
        paidAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'payments',
        timestamps: false
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.Family, { foreignKey: 'familyId' });
        Payment.belongsTo(models.User, { as: 'receivedBy', foreignKey: 'receivedById' });
    };

    return Payment;
};
