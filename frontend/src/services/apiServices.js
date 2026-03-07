import api from './api';

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data.data;
    }
};

export const studentService = {
    getStudents: async (params) => {
        // params can include: search, branchId, currentClass
        const response = await api.get('/students', { params });
        return response.data.data;
    },

    admitStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    }
};
