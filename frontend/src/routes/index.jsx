import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

/**
 * Application route configuration.
 *
 * Structure:
 * ├── / (MainLayout)          → public pages
 * │   └── index               → Landing page
 * ├── /login (AuthLayout)     → auth pages
 * │   └── index               → Login form
 * ├── /forgot-password (AuthLayout)
 * ├── /reset-password (AuthLayout)
 * ├── /dashboard (DashboardLayout) → protected pages
 * │   └── index               → Dashboard home
 * └── * → 404 Not Found
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Landing /> },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password', element: <ResetPassword /> },
        ],
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Dashboard /> },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
