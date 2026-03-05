/**
 * Application-wide constants.
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Buraq School';

export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
};
