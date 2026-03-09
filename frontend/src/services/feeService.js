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
    }
};

export default feeService;
