import api from './api';

const userService = {
    /**
     * Admin: Get all users with pagination and filters
     */
    getUsers: async (params) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    /**
     * Admin: Update user details
     */
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    /**
     * Admin: Toggle user active status
     */
    toggleStatus: async (id) => {
        const response = await api.patch(`/users/${id}/toggle-status`);
        return response.data;
    },

    /**
     * Admin: Delete user
     */
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    /**
     * Admin: Update user password
     */
    updateUserPassword: async (id, newPassword) => {
        const response = await api.patch(`/users/${id}/password`, { newPassword });
        return response.data;
    },

    /**
     * User: Update own profile
     */
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    /**
     * User: Update own password
     */
    updateMyPassword: async (passwordData) => {
        const response = await api.patch('/users/profile/password', passwordData);
        return response.data;
    }
};

export default userService;
