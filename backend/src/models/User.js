const prisma = require('../config/prisma');

/**
 * User Model
 * Database query methods using Prisma Client.
 */
const User = {
    /**
     * Find a user by ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    findById: async (id) => {
        return prisma.user.findUnique({ where: { id } });
    },

    /**
     * Find a user by email.
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    findByEmail: async (email) => {
        return prisma.user.findUnique({ where: { email } });
    },

    /**
     * Find a user by username.
     * @param {string} username
     * @returns {Promise<Object|null>}
     */
    findByUsername: async (username) => {
        return prisma.user.findUnique({ where: { username } });
    },

    /**
     * Find a user by email or username (for login).
     * @param {string} identifier - email or username
     * @returns {Promise<Object|null>}
     */
    findByEmailOrUsername: async (identifier) => {
        return prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });
    },

    /**
     * Create a new user.
     * @param {Object} userData - { name, email, username, password, phone, role, branchId }
     * @returns {Promise<Object>}
     */
    create: async (userData) => {
        return prisma.user.create({
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                branchId: true,
                createdAt: true,
            },
        });
    },

    /**
     * Get all users with optional filters.
     * @param {Object} where - Prisma where clause
     * @returns {Promise<Array>}
     */
    findAll: async (where = {}) => {
        return prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                branchId: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    /**
     * Update a user by ID.
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    update: async (id, data) => {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                branchId: true,
                updatedAt: true,
            },
        });
    },

    /**
     * Delete a user by ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    delete: async (id) => {
        return prisma.user.delete({ where: { id } });
    },
};

module.exports = User;
