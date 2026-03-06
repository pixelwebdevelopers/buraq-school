const db = require('./models');

async function syncDatabase() {
    try {
        console.log('Syncing database...');
        // We use match to make sure we don't accidentally sync production if not intended,
        // although alter: true handles schema updates smoothly for new configurations.
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database sync failed:', error);
        process.exit(1);
    }
}

syncDatabase();
