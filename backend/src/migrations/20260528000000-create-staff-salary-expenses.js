'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Staff
        await queryInterface.createTable('staff', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Sequelize.STRING(150), allowNull: false },
            profession: { type: Sequelize.STRING(100), allowNull: false },
            baseSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            medicalLeaves: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            phone: { type: Sequelize.STRING(20), allowNull: true },
            cnic: { type: Sequelize.STRING(20), allowNull: true },
            address: { type: Sequelize.STRING(255), allowNull: true },
            joiningDate: { type: Sequelize.DATEONLY, allowNull: true },
            branchId: { type: Sequelize.INTEGER, allowNull: false },
            status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'ACTIVE' },
            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('staff', {
            fields: ['branchId'],
            type: 'foreign key',
            name: 'staff_branchId_fk',
            references: { table: 'branches', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // 2. Salary Slips
        await queryInterface.createTable('salary_slips', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            staffId: { type: Sequelize.INTEGER, allowNull: false },
            branchId: { type: Sequelize.INTEGER, allowNull: false },
            month: { type: Sequelize.INTEGER, allowNull: false },
            year: { type: Sequelize.INTEGER, allowNull: false },
            monthDays: { type: Sequelize.INTEGER, allowNull: false },
            existingDays: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            baseSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            calculatedSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            allowances: { type: Sequelize.TEXT, allowNull: true },
            deductions: { type: Sequelize.TEXT, allowNull: true },
            allowanceTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            deductionTotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            payableSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            medicalLeavesSnapshot: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            professionSnapshot: { type: Sequelize.STRING(100), allowNull: true },
            nameSnapshot: { type: Sequelize.STRING(150), allowNull: true },
            notes: { type: Sequelize.TEXT, allowNull: true },
            createdById: { type: Sequelize.INTEGER, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('salary_slips', {
            fields: ['staffId'],
            type: 'foreign key',
            name: 'salary_slips_staffId_fk',
            references: { table: 'staff', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('salary_slips', {
            fields: ['branchId'],
            type: 'foreign key',
            name: 'salary_slips_branchId_fk',
            references: { table: 'branches', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('salary_slips', {
            fields: ['createdById'],
            type: 'foreign key',
            name: 'salary_slips_createdById_fk',
            references: { table: 'users', field: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('salary_slips', {
            fields: ['staffId', 'month', 'year'],
            type: 'unique',
            name: 'salary_slips_staff_month_year_unique'
        });

        // 3. Additional Expenses
        await queryInterface.createTable('additional_expenses', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            branchId: { type: Sequelize.INTEGER, allowNull: false },
            month: { type: Sequelize.INTEGER, allowNull: false },
            year: { type: Sequelize.INTEGER, allowNull: false },
            name: { type: Sequelize.STRING(150), allowNull: false },
            amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
            notes: { type: Sequelize.TEXT, allowNull: true },
            createdById: { type: Sequelize.INTEGER, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('additional_expenses', {
            fields: ['branchId'],
            type: 'foreign key',
            name: 'additional_expenses_branchId_fk',
            references: { table: 'branches', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('additional_expenses', {
            fields: ['createdById'],
            type: 'foreign key',
            name: 'additional_expenses_createdById_fk',
            references: { table: 'users', field: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('additional_expenses');
        await queryInterface.dropTable('salary_slips');
        await queryInterface.dropTable('staff');
    }
};
