'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('fee_logs');
    if (!tableInfo.extraChargeName) {
      await queryInterface.addColumn('fee_logs', 'extraChargeName', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    if (!tableInfo.extraChargeAmount) {
      await queryInterface.addColumn('fee_logs', 'extraChargeAmount', {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('fee_logs', 'extraChargeName');
    await queryInterface.removeColumn('fee_logs', 'extraChargeAmount');
  }
};
