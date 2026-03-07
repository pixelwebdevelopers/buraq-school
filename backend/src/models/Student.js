module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        admissionNo: { type: DataTypes.STRING(30), unique: true, allowNull: false },
        referenceNo: { type: DataTypes.STRING(30) },
        name: { type: DataTypes.STRING(100), allowNull: false },
        dateOfBirth: { type: DataTypes.STRING(20) },
        formBNicNo: { type: DataTypes.STRING(30) },
        previousSchool: { type: DataTypes.STRING(150) },
        caste: { type: DataTypes.STRING(50) },
        religion: { type: DataTypes.STRING(50) },
        gender: { type: DataTypes.STRING(10) },
        classAdmitted: { type: DataTypes.STRING(30) },
        currentClass: { type: DataTypes.STRING(20) }, // playgroup, nursery, 1-10, first year, second year
        section: { type: DataTypes.STRING(10) },
        referenceInSchool: { type: DataTypes.STRING(100) },
        specialInfo: { type: DataTypes.TEXT },
        guardianName: { type: DataTypes.STRING(100) },
        guardianRelation: { type: DataTypes.STRING(50) },
        houseNo: { type: DataTypes.STRING(20) },
        streetNo: { type: DataTypes.STRING(20) },
        blockPhase: { type: DataTypes.STRING(50) },
        mohallahColony: { type: DataTypes.STRING(100) },
        cell1: { type: DataTypes.STRING(20) },
        cell2: { type: DataTypes.STRING(20) },
        whatsapp: { type: DataTypes.STRING(20) },
        schoolLeavingCert: { type: DataTypes.BOOLEAN, defaultValue: false },
        characterCert: { type: DataTypes.BOOLEAN, defaultValue: false },
        birthCert: { type: DataTypes.BOOLEAN, defaultValue: false },
        admissionFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        monthlyFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        annualCharges: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        academyFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        labMiscFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        familyId: { type: DataTypes.INTEGER, allowNull: false },
        enrolledById: { type: DataTypes.INTEGER },
        admissionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'students',
        timestamps: true
    });

    Student.associate = (models) => {
        Student.belongsTo(models.Branch, { foreignKey: 'branchId' });
        Student.belongsTo(models.Family, { foreignKey: 'familyId' });
        Student.belongsTo(models.User, { as: 'enrolledBy', foreignKey: 'enrolledById' });
        Student.hasMany(models.FeeLog, { foreignKey: 'studentId' });
    };

    return Student;
};
