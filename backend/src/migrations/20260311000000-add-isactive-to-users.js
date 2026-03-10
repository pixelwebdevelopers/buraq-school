'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'isActive', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            after: 'branchId'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'isActive');
    }
};
