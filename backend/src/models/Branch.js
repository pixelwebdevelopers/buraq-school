module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define('Branch', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        principalId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        },
    }, {
        tableName: 'branches',
        timestamps: true,
    });

    Branch.associate = (models) => {
        Branch.belongsTo(models.User, { as: 'principal', foreignKey: 'principalId' });
        Branch.hasMany(models.User, { as: 'staff', foreignKey: 'branchId' });
        Branch.hasMany(models.Student, { foreignKey: 'branchId' });
        Branch.hasMany(models.Family, { foreignKey: 'branchId' });
    };

    return Branch;
};
