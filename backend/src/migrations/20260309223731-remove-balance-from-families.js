'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('families', 'balance');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('families', 'balance', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
    });
  }
};

