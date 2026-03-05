import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — layout wrapper for authentication pages (login, register, forgot password).
 * Minimal chrome, centered content.
 */
export default function AuthLayout() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4">
            <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-primary">Buraq School</h1>
                    <p className="mt-1 text-sm text-text-secondary">Web Portal</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
