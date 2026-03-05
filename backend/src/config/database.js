const mysql = require('mysql2/promise');

/**
 * MySQL connection pool configuration.
 * Uses environment variables for credentials.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'buraq_school',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

/**
 * Test database connectivity.
 * @returns {Promise<void>}
 */
async function testConnection() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
    } finally {
        connection.release();
    }
}

/**
 * Execute a parameterized query.
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Parameter values
 * @returns {Promise<Array>}
 */
async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

module.exports = {
    pool,
    query,
    testConnection,
};
