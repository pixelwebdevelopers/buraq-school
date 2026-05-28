import api from './api';

const analyticsService = {
    getFinancialOverview: async ({ branchId, year } = {}) => {
        const response = await api.get('/analytics/financial', { params: { branchId, year } });
        return response.data.data;
    }
};

export default analyticsService;
