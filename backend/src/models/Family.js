module.exports = (sequelize, DataTypes) => {
    const Family = sequelize.define('Family', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fatherName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        fatherPhone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        fatherOccupation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        branchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'families',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['fatherPhone', 'branchId']
            }
        ]
    });

    Family.associate = (models) => {
        Family.belongsTo(models.Branch, { foreignKey: 'branchId' });
        Family.hasMany(models.Student, { foreignKey: 'familyId' });
        Family.hasMany(models.Payment, { foreignKey: 'familyId' });
        Family.hasMany(models.FeeLog, { foreignKey: 'familyId' });
    };

    return Family;
};
