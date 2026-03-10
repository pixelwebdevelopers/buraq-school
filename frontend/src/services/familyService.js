import api from './api';

export const familyService = {
    /**
     * Search families by phone or name
     * @param {string} query
     * @returns {Promise<Object>}
     */
    searchFamilies: async (query) => {
        const response = await api.get('/families/search', { params: { query } });
        return response.data;
    },

    /**
     * Look up family and common details by phone and branch
     * @param {string} phone
     * @param {number|string} branchId
     * @returns {Promise<Object>}
     */
    lookupFamilyByPhone: async (phone, branchId) => {
        const response = await api.get('/families/lookup', { params: { phone, branchId } });
        return response.data;
    },

    /**
     * Get students for a specific family
     * @param {number} familyId 
     * @returns {Promise<Object>}
     */
    getFamilyStudents: async (familyId) => {
        const response = await api.get(`/families/${familyId}/students`);
        return response.data;
    },

    /**
     * Update family information
     * @param {number} familyId 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    updateFamily: async (familyId, data) => {
        const response = await api.put(`/families/${familyId}`, data);
        return response.data;
    }
};

export default familyService;
