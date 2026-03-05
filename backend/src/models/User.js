const db = require('../config/database');

/**
 * User Model
 * Database query methods for the users table.
 * TODO: Create users table migration when implementing auth.
 */
const User = {
    /**
     * Find a user by ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    findById: async (id) => {
        const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    },

    /**
     * Find a user by email.
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    findByEmail: async (email) => {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    },

    /**
     * Create a new user.
     * @param {Object} userData - { name, email, password, role }
     * @returns {Promise<Object>}
     */
    create: async (userData) => {
        const { name, email, password, role = 'student' } = userData;
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return { id: result.insertId, name, email, role };
    },

    /**
     * Get all users.
     * @returns {Promise<Array>}
     */
    findAll: async () => {
        return db.query('SELECT id, name, email, role, created_at FROM users');
    },
};

module.exports = User;
