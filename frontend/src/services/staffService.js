import api from './api';

const staffService = {
    getStaff: async (params) => {
        const response = await api.get('/staff', { params });
        return response.data;
    },

    getStaffById: async (id) => {
        const response = await api.get(`/staff/${id}`);
        return response.data.data;
    },

    createStaff: async (data) => {
        const response = await api.post('/staff', data);
        return response.data;
    },

    updateStaff: async (id, data) => {
        const response = await api.put(`/staff/${id}`, data);
        return response.data;
    },

    deleteStaff: async (id) => {
        const response = await api.delete(`/staff/${id}`);
        return response.data;
    }
};

export default staffService;
