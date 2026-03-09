'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVE', // e.g., ACTIVE, LEFT, SUSPENDED, PASSED_OUT, STRUCK_OFF
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('students', 'status');
  }
};

