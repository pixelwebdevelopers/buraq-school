import api from './api';

const feeService = {
    /**
     * Get paginated fee vouchers and total balance for a student
     * @param {number} studentId 
     * @param {Object} params - Query params (page, limit)
     * @returns {Promise<Object>}
     */
    getStudentFees: async (studentId, params = {}) => {
        const response = await api.get(`/fees/student/${studentId}`, { params });
        return response.data;
    },

    /**
     * Generate a new fee voucher
     * @param {Object} data - { studentId, month, year }
     * @returns {Promise<Object>}
     */
    generateVoucher: async (data) => {
        const response = await api.post('/fees/generate', data);
        return response.data;
    },

    /**
     * Update payment amount for a voucher
     * @param {number} voucherId 
     * @param {Object} data - { paidAmount }
     * @returns {Promise<Object>}
     */
    payVoucher: async (voucherId, data) => {
        const response = await api.put(`/fees/${voucherId}/pay`, data);
        return response.data;
    },

    /**
     * Get family fees (grouped by month/year) and collective balance
     * @param {number} familyId 
     * @returns {Promise<Object>}
     */
    getFamilyFees: async (familyId) => {
        const response = await api.get(`/fees/family/${familyId}`);
        return response.data;
    },

    /**
     * Bulk generate vouchers for all students in a family
     * @param {Object} data - { familyId, month, year }
     * @returns {Promise<Object>}
     */
    generateFamilyVouchers: async (data) => {
        const response = await api.post('/fees/family/generate', data);
        return response.data;
    }
};

export default feeService;
