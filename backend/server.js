const app = require('./app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

/**
 * Start the server and verify database connectivity.
 */
async function startServer() {
    try {
        // Test database connection
        await db.testConnection();
        console.log('✅  Database connected successfully');

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀  Buraq School API server running on port ${PORT}`);
            console.log(`📍  Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗  http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌  Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
