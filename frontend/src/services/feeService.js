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
    getFamilyFees: async (familyId, params = {}) => {
        const response = await api.get(`/fees/family/${familyId}`, { params });
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
    },

    /**
     * Bulk generate vouchers for a class/branch
     * @param {Object} data - { branchId, currentClass, month, year }
     * @returns {Promise<Object>}
     */
    bulkGenerateVouchers: async (data) => {
        const response = await api.post('/fees/bulk-generate', data);
        return response.data;
    },

    /**
     * Get bulk vouchers for viewing/printing
     * @param {Object} params - { branchId, currentClass, month, year }
     * @returns {Promise<Object>}
     */
    getBulkFees: async (params) => {
        const response = await api.get('/fees/bulk', { params });
        return response.data;
    },

    /**
     * Get bulk family vouchers for collective printing
     * @param {Object} params - { branchId, currentClass, month, year }
     * @returns {Promise<Object>}
     */
    getBulkFamilyFees: async (params) => {
        const response = await api.get('/fees/bulk-family', { params });
        return response.data;
    },

    /**
     * Get report of students with pending balances
     * @param {Object} params - { branchId, currentClass }
     * @returns {Promise<Object>}
     */
    getPendingFeesReport: async (params) => {
        const response = await api.get('/fees/report/pending', { params });
        return response.data;
    },

    /**
     * Delete a fee voucher
     * @param {number} voucherId 
     * @returns {Promise<Object>}
     */
    deleteVoucher: async (voucherId) => {
        const response = await api.delete(`/fees/${voucherId}`);
        return response.data;
    },

    /**
     * Collect bulk payment for a family or student
     * @param {Object} data - { familyId, studentId, amount }
     */
    collectBulkPayment: async (data) => {
        const response = await api.post('/fees/collect-bulk', data);
        return response.data;
    },

    /**
     * Apply bulk discount for a family or student
     * @param {Object} data - { familyId, studentId, amount }
     */
    applyBulkDiscount: async (data) => {
        const response = await api.post('/fees/apply-discount', data);
        return response.data;
    }
};

export default feeService;
