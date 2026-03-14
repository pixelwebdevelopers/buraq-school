module.exports = (sequelize, DataTypes) => {
    const FeeCollectionLog = sequelize.define('FeeCollectionLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        familyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        feeLogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amountPaid: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        paymentMode: {
            type: DataTypes.STRING(50),
            defaultValue: 'CASH',
        },
        remarks: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        receivedById: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        branchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'fee_collection_logs',
        timestamps: true,
    });

    FeeCollectionLog.associate = (models) => {
        FeeCollectionLog.belongsTo(models.Family, { foreignKey: 'familyId' });
        FeeCollectionLog.belongsTo(models.Student, { foreignKey: 'studentId' });
        FeeCollectionLog.belongsTo(models.FeeLog, { foreignKey: 'feeLogId' });
        FeeCollectionLog.belongsTo(models.User, { as: 'receivedBy', foreignKey: 'receivedById' });
        FeeCollectionLog.belongsTo(models.Branch, { foreignKey: 'branchId' });
    };

    return FeeCollectionLog;
};
