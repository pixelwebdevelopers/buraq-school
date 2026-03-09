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

import Branches from '@/pages/Branches';
import Students from '@/pages/Students';
import FamilyTree from '@/pages/FamilyTree';

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
 * │   └── branches            → Branches management (Admin)
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
            { path: 'branches', element: <Branches /> },
            { path: 'students', element: <Students /> },
            { path: 'family-tree', element: <FamilyTree /> },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
