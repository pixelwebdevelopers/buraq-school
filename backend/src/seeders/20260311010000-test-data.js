'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create Branches
        const branches = [
            { name: 'Buraq North Campus', address: 'Block A, North Area', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Buraq South Campus', address: 'Street 5, South Sector', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Buraq East Campus', address: 'Phase 2, East Heights', createdAt: new Date(), updatedAt: new Date() }
        ];

        await queryInterface.bulkInsert('branches', branches);
        const [branchRows] = await queryInterface.sequelize.query('SELECT id FROM branches ORDER BY id DESC LIMIT 3');
        const branchIds = branchRows.map(b => b.id);

        const firstNames = ['Ahmed', 'Ali', 'Zain', 'Bilal', 'Omar', 'Hamza', 'Saad', 'Usman', 'Mustafa', 'Hassan'];
        const lastNames = ['Khan', 'Sheikh', 'Malik', 'Qureshi', 'Siddiqui', 'Raza', 'Shah', 'Abbas', 'Mirza', 'Lodhi'];
        const occupations = ['Businessman', 'Engineer', 'Doctor', 'Teacher', 'Officer', 'Banker', 'Manager', 'Lawyer'];
        const classes = ['playgroup', 'nursery', 'prep', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'firstyear', 'secondyear'];

        let allStudents = [];
        let allFamilies = [];

        // 2. Create families and students for each branch
        for (const branchId of branchIds) {
            for (let i = 0; i < 20; i++) {
                const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
                
                const family = {
                    fatherName: `${fName} ${lName}`,
                    fatherPhone: `0300${Math.floor(1000000 + Math.random() * 9000000)}`,
                    fatherOccupation: occupations[Math.floor(Math.random() * occupations.length)],
                    branchId: branchId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                // We need to insert one by one or get IDs back to link students
                await queryInterface.bulkInsert('families', [family]);
                const [familyRows] = await queryInterface.sequelize.query('SELECT id FROM families ORDER BY id DESC LIMIT 1');
                const familyId = familyRows[0].id;

                // Create 1-3 students for this family
                const studentCount = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < studentCount; j++) {
                    const sFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                    const rollNo = `R-${branchId}-${familyId}-${j}`;
                    const admNo = `ADM-${branchId}-${familyId}-${j}-${Math.floor(Math.random() * 1000)}`;

                    const student = {
                        admissionNo: admNo,
                        referenceNo: rollNo,
                        name: `${sFirstName} ${lName}`,
                        currentClass: classes[Math.floor(Math.random() * classes.length)],
                        monthlyFee: 2000 + (Math.floor(Math.random() * 30) * 100),
                        academyFee: Math.random() > 0.7 ? 1500 : 0,
                        labMiscFee: Math.random() > 0.5 ? 200 : 0,
                        branchId: branchId,
                        familyId: familyId,
                        status: 'ACTIVE',
                        admissionDate: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    
                    await queryInterface.bulkInsert('students', [student]);
                    const [studentRows] = await queryInterface.sequelize.query('SELECT id FROM students ORDER BY id DESC LIMIT 1');
                    const studentId = studentRows[0].id;

                    // Create 12 months history for this student
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth() + 1;

                    for (let m = 1; m <= 12; m++) {
                        // Only seed vouchers up to current month of current year or all of last year
                        let year = currentYear;
                        if (m > currentMonth) year = currentYear - 1;

                        const amount = parseFloat(student.monthlyFee) + parseFloat(student.academyFee) + parseFloat(student.labMiscFee);
                        const statusRoll = Math.random();
                        let status = 'PENDING';
                        let paidAmount = 0;

                        if (statusRoll > 0.6) {
                            status = 'PAID';
                            paidAmount = amount;
                        } else if (statusRoll > 0.4) {
                            status = 'PARTIAL';
                            paidAmount = Math.floor(amount / 2);
                        }

                        await queryInterface.bulkInsert('fee_logs', [{
                            familyId: familyId,
                            studentId: studentId,
                            amount: amount,
                            month: m,
                            year: year,
                            monthlyFee: student.monthlyFee,
                            academyFee: student.academyFee,
                            labMiscFee: student.labMiscFee,
                            paidAmount: paidAmount,
                            status: status,
                            type: 'MONTHLY',
                            description: `Monthly Fee - ${m}/${year}`,
                            billedAt: new Date(year, m - 1, 5),
                            createdAt: new Date(year, m - 1, 5)
                        }]);
                    }
                }
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Risk: deleting all data. But since it's for testing... 
        // Better to just delete by known branch names
        await queryInterface.bulkDelete('branches', { name: { [Sequelize.Op.in]: ['Buraq North Campus', 'Buraq South Campus', 'Buraq East Campus'] } }, {});
    }
};
