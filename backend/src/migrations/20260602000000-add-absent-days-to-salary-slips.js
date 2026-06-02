'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('salary_slips', 'absentDays', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
        // Backfill so existing slips keep the same intent under the new
        // two-input compute model: previously, absences were implicit
        // (monthDays - existingDays). We materialise that here so editing
        // an old slip after the upgrade doesn't suddenly inflate salaries.
        await queryInterface.sequelize.query(
            'UPDATE salary_slips SET absentDays = GREATEST(0, monthDays - existingDays);'
        );
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('salary_slips', 'absentDays');
    }
};
