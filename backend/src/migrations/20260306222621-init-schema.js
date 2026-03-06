'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create Branches Table
    await queryInterface.createTable('branches', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      address: { type: Sequelize.STRING(500), allowNull: false },
      principalId: { type: Sequelize.INTEGER, allowNull: true, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Create Users Table
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), unique: true, allowNull: false },
      username: { type: Sequelize.STRING(50), unique: true, allowNull: false },
      password: { type: Sequelize.STRING(255), allowNull: false },
      phone: { type: Sequelize.STRING(20) },
      role: { type: Sequelize.ENUM('ADMIN', 'PRINCIPAL', 'STAFF'), defaultValue: 'STAFF' },
      branchId: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Add Foreign Keys for Users and Branches
    await queryInterface.addConstraint('branches', {
      fields: ['principalId'],
      type: 'foreign key',
      name: 'branches_principalId_fk',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('users', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'users_branchId_fk',
      references: { table: 'branches', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // 4. Create Families Table
    await queryInterface.createTable('families', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      fatherName: { type: Sequelize.STRING(100), allowNull: false },
      fatherPhone: { type: Sequelize.STRING(20), allowNull: false },
      fatherOccupation: { type: Sequelize.STRING(100), allowNull: true },
      balance: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      branchId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('families', {
      fields: ['fatherPhone', 'branchId'],
      type: 'unique',
      name: 'families_fatherPhone_branchId_unique'
    });

    await queryInterface.addConstraint('families', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'families_branchId_fk',
      references: { table: 'branches', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // 5. Create Students Table
    await queryInterface.createTable('students', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      admissionNo: { type: Sequelize.STRING(30), unique: true, allowNull: false },
      referenceNo: { type: Sequelize.STRING(30) },
      name: { type: Sequelize.STRING(100), allowNull: false },
      dateOfBirth: { type: Sequelize.STRING(20) },
      formBNicNo: { type: Sequelize.STRING(30) },
      previousSchool: { type: Sequelize.STRING(150) },
      caste: { type: Sequelize.STRING(50) },
      religion: { type: Sequelize.STRING(50) },
      gender: { type: Sequelize.STRING(10) },
      classAdmitted: { type: Sequelize.STRING(30) },
      referenceInSchool: { type: Sequelize.STRING(100) },
      specialInfo: { type: Sequelize.TEXT },
      guardianName: { type: Sequelize.STRING(100) },
      guardianRelation: { type: Sequelize.STRING(50) },
      houseNo: { type: Sequelize.STRING(20) },
      streetNo: { type: Sequelize.STRING(20) },
      blockPhase: { type: Sequelize.STRING(50) },
      mohallahColony: { type: Sequelize.STRING(100) },
      cell1: { type: Sequelize.STRING(20) },
      cell2: { type: Sequelize.STRING(20) },
      whatsapp: { type: Sequelize.STRING(20) },
      schoolLeavingCert: { type: Sequelize.BOOLEAN, defaultValue: false },
      characterCert: { type: Sequelize.BOOLEAN, defaultValue: false },
      birthCert: { type: Sequelize.BOOLEAN, defaultValue: false },
      admissionFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      monthlyFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      annualCharges: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      academyFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      labMiscFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      branchId: { type: Sequelize.INTEGER, allowNull: false },
      familyId: { type: Sequelize.INTEGER, allowNull: false },
      enrolledById: { type: Sequelize.INTEGER },
      admissionDate: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('students', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'students_branchId_fk',
      references: { table: 'branches', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('students', {
      fields: ['familyId'],
      type: 'foreign key',
      name: 'students_familyId_fk',
      references: { table: 'families', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('students', {
      fields: ['enrolledById'],
      type: 'foreign key',
      name: 'students_enrolledById_fk',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // 6. Create Payments Table
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      familyId: { type: Sequelize.INTEGER, allowNull: false },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      method: { type: Sequelize.STRING(30) },
      remarks: { type: Sequelize.TEXT },
      receivedById: { type: Sequelize.INTEGER },
      paidAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('payments', {
      fields: ['familyId'],
      type: 'foreign key',
      name: 'payments_familyId_fk',
      references: { table: 'families', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('payments', {
      fields: ['receivedById'],
      type: 'foreign key',
      name: 'payments_receivedById_fk',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // 7. Create FeeLogs Table
    await queryInterface.createTable('fee_logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      familyId: { type: Sequelize.INTEGER, allowNull: false },
      studentId: { type: Sequelize.INTEGER },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      type: { type: Sequelize.STRING(30), allowNull: false },
      description: { type: Sequelize.STRING(255) },
      billedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('fee_logs', {
      fields: ['familyId'],
      type: 'foreign key',
      name: 'fee_logs_familyId_fk',
      references: { table: 'families', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('fee_logs', {
      fields: ['studentId'],
      type: 'foreign key',
      name: 'fee_logs_studentId_fk',
      references: { table: 'students', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop in reverse order of dependencies
    await queryInterface.removeConstraint('users', 'users_branchId_fk');
    await queryInterface.removeConstraint('branches', 'branches_principalId_fk');

    await queryInterface.dropTable('fee_logs');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('students');
    await queryInterface.dropTable('families');
    await queryInterface.dropTable('branches');
    await queryInterface.dropTable('users');
  }
};
