'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('fee_logs', 'month', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('fee_logs', 'year', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('fee_logs', 'monthlyFee', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('fee_logs', 'academyFee', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('fee_logs', 'labMiscFee', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('fee_logs', 'paidAmount', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('fee_logs', 'status', {
      type: Sequelize.STRING(30),
      defaultValue: 'PENDING'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('fee_logs', 'month');
    await queryInterface.removeColumn('fee_logs', 'year');
    await queryInterface.removeColumn('fee_logs', 'monthlyFee');
    await queryInterface.removeColumn('fee_logs', 'academyFee');
    await queryInterface.removeColumn('fee_logs', 'labMiscFee');
    await queryInterface.removeColumn('fee_logs', 'paidAmount');
    await queryInterface.removeColumn('fee_logs', 'status');
  }
};
