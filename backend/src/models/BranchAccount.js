module.exports = (sequelize, DataTypes) => {
    const BranchAccount = sequelize.define('BranchAccount', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        branchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accountTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'branch_accounts',
        timestamps: true,
    });

    BranchAccount.associate = (models) => {
        BranchAccount.belongsTo(models.Branch, { foreignKey: 'branchId' });
    };

    return BranchAccount;
};
