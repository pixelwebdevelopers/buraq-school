import api from './api';

const branchService = {
    getAllBranches: async () => {
        const response = await api.get('/branches');
        return response.data.data;
    },

    getBranchById: async (id) => {
        const response = await api.get(`/branches/${id}`);
        return response.data.data;
    },

    createBranch: async (branchData) => {
        const response = await api.post('/branches', branchData);
        return response.data;
    },

    updateBranch: async (id, branchData) => {
        const response = await api.put(`/branches/${id}`, branchData);
        return response.data;
    }
};

export default branchService;
