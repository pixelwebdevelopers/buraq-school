import api from './api';

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data.data;
    }
};

export const studentService = {
    getStudents: async (params) => {
        // params can include: search, branchId, currentClass, page, limit
        const response = await api.get('/students', { params });
        return response.data;
    },

    admitStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },
    
    deleteStudent: async (id) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    }
};
