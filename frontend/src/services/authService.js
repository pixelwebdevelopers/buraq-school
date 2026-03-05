import api from './api';

/**
 * Authentication service — handles login, logout, registration, and session checks.
 */
const authService = {
    /**
     * Login with email and password.
     * @param {Object} credentials - { email, password }
     * @returns {Promise}
     */
    login: (credentials) => api.post('/auth/login', credentials),

    /**
     * Register a new user.
     * @param {Object} userData - { name, email, password, role }
     * @returns {Promise}
     */
    register: (userData) => api.post('/auth/register', userData),

    /**
     * Logout the current user.
     * @returns {Promise}
     */
    logout: () => api.post('/auth/logout'),

    /**
     * Get the currently authenticated user's profile.
     * @returns {Promise}
     */
    getProfile: () => api.get('/auth/me'),
};

export default authService;
