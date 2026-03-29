'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fee_collection_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      familyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      feeLogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      paymentMode: {
        type: Sequelize.STRING(50),
        defaultValue: 'CASH',
      },
      remarks: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      receivedById: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      branchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });

    // Add Foreign Keys
    await queryInterface.addConstraint('fee_collection_logs', {
      fields: ['familyId'],
      type: 'foreign key',
      name: 'fcl_familyId_fk',
      references: { table: 'families', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('fee_collection_logs', {
      fields: ['studentId'],
      type: 'foreign key',
      name: 'fcl_studentId_fk',
      references: { table: 'students', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('fee_collection_logs', {
      fields: ['feeLogId'],
      type: 'foreign key',
      name: 'fcl_feeLogId_fk',
      references: { table: 'fee_logs', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('fee_collection_logs', {
      fields: ['receivedById'],
      type: 'foreign key',
      name: 'fcl_receivedById_fk',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('fee_collection_logs', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'fcl_branchId_fk',
      references: { table: 'branches', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fee_collection_logs');
  }
};
