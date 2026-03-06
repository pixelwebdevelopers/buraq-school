'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const adminPassword = await bcrypt.hash('admin123', 10);

        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email='admin@buraqschool.com'`
        );

        if (users[0].length === 0) {
            await queryInterface.bulkInsert('users', [{
                name: 'Admin',
                email: 'admin@buraqschool.com',
                username: 'admin',
                password: adminPassword,
                phone: null,
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', { email: 'admin@buraqschool.com' }, {});
    }
};
