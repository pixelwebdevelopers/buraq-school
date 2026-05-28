module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        profession: { type: DataTypes.STRING(100), allowNull: false },
        baseSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        medicalLeaves: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        phone: { type: DataTypes.STRING(20) },
        cnic: { type: DataTypes.STRING(20) },
        address: { type: DataTypes.STRING(255) },
        joiningDate: { type: DataTypes.DATEONLY },
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'ACTIVE' }
    }, {
        tableName: 'staff',
        timestamps: true
    });

    Staff.associate = (models) => {
        Staff.belongsTo(models.Branch, { foreignKey: 'branchId' });
        Staff.hasMany(models.SalarySlip, { foreignKey: 'staffId' });
    };

    return Staff;
};
