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
                // Token expired or invalid — clear auth and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }

            if (status === 500) {
                console.error('[API] Internal server error:', error.response.data);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
