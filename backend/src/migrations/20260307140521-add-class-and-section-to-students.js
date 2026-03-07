'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('students', 'currentClass', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('students', 'section', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'currentClass');
    await queryInterface.removeColumn('students', 'section');
  }
};
