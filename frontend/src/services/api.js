import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Axios instance pre-configured for Buraq School API.
 * - Base URL from environment variables
 * - JSON content type
 * - Credentials included for cookie-based auth
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

/*
 * ── Request Interceptor ──
 * Automatically attaches the auth token (if available) to every outgoing request.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/*
 * ── Response Interceptor ──
 * Handles common error scenarios globally (401, 500, etc.).
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.error('[API] Unauthorized (401): Your session has expired or is invalid. Redirecting to login.');
                // Token expired or invalid — clear auth and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (status === 403) {
                console.error('[API] Forbidden (403): You do not have permission to perform this action.');
            } else if (status === 500) {
                console.error('[API] Internal Server Error (500):', error.response.data);
            } else {
                console.error(`[API] Request failed with status ${status}:`, error.response.data);
            }
        } else if (error.request) {
            console.error('[API] Network Error: No response received from server. Please check your connection.');
        } else {
            console.error('[API] Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
