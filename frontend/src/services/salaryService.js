import api from './api';

const salaryService = {
    getMonthlySheet: async ({ branchId, month, year }) => {
        const response = await api.get('/salaries/sheet', { params: { branchId, month, year } });
        return response.data.data;
    },

    upsertSlip: async (payload) => {
        const response = await api.post('/salaries/slips', payload);
        return response.data.data;
    },

    deleteSlip: async (id) => {
        const response = await api.delete(`/salaries/slips/${id}`);
        return response.data;
    },

    getStaffSlipHistory: async (staffId) => {
        const response = await api.get('/salaries/slips/history', { params: { staffId } });
        return response.data.data;
    },

    addExpense: async (payload) => {
        const response = await api.post('/salaries/expenses', payload);
        return response.data.data;
    },

    updateExpense: async (id, payload) => {
        const response = await api.put(`/salaries/expenses/${id}`, payload);
        return response.data.data;
    },

    deleteExpense: async (id) => {
        const response = await api.delete(`/salaries/expenses/${id}`);
        return response.data;
    }
};

export default salaryService;
