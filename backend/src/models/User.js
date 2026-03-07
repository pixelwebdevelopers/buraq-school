module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
        username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
        password: { type: DataTypes.STRING(255), allowNull: false },
        phone: { type: DataTypes.STRING(20) },
        role: { type: DataTypes.ENUM('ADMIN', 'PRINCIPAL', 'STAFF'), defaultValue: 'STAFF' },
        branchId: { type: DataTypes.INTEGER },
        resetPasswordToken: { type: DataTypes.STRING(255) },
        resetPasswordExpires: { type: DataTypes.DATE }
    }, {
        tableName: 'users',
        timestamps: true
    });

    User.associate = (models) => {
        User.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId' });
        User.hasOne(models.Branch, { as: 'principalBranch', foreignKey: 'principalId' });
        User.hasMany(models.Student, { as: 'enrolledStudents', foreignKey: 'enrolledById' });
        User.hasMany(models.Payment, { as: 'receivedPayments', foreignKey: 'receivedById' });
    };

    // Wrapper methods for Prisma backwards compatibility
    User.findById = async (id) => User.findByPk(id);
    User.findByEmail = async (email) => User.findOne({ where: { email } });
    User.findByUsername = async (username) => User.findOne({ where: { username } });

    User.findByEmailOrUsername = async (identifier) => {
        const { Op } = require('sequelize');
        return User.findOne({
            where: {
                [Op.or]: [{ email: identifier }, { username: identifier }]
            }
        });
    };

    // We intentionally use Sequelize's native create, update, delete, findAll.
    // The custom methods are those findBy* which Prisma had natively.

    return User;
};
