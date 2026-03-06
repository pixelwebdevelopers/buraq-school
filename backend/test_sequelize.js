const { sequelize, User, Branch } = require('./src/models');

async function testSequelize() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        const admin = await User.findByEmail('admin@buraqschool.com');
        if (admin) {
            console.log('✅ Found admin user:', admin.email);
        } else {
            console.log('❌ Admin user not found. Seeder might have failed.');
        }

        // Try finding all users using our wrapped method
        const allUsers = await User.findAll();
        console.log(`✅ Current total users: ${allUsers.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database or run tests:', error);
        process.exit(1);
    }
}

testSequelize();
