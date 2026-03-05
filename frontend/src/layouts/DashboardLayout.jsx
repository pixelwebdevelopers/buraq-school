import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * DashboardLayout — layout for authenticated portal pages.
 * Redirects to login if the user is not authenticated.
 */
export default function DashboardLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* TODO: Add Sidebar component */}
            <aside className="hidden w-64 border-r border-border bg-surface lg:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-primary">Portal</h2>
                </div>
                <nav className="px-4">{/* Sidebar navigation links */}</nav>
            </aside>

            {/* Main content area */}
            <div className="flex flex-1 flex-col">
                {/* TODO: Add TopBar component */}
                <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
                    <h2 className="text-lg font-semibold text-text-primary">Dashboard</h2>
                </header>

                <main className="flex-1 p-6">
                    {/* Protected page content will render here */}
                    <div className="mx-auto max-w-7xl">
                        {/* Child routes will go here via Outlet in the future */}
                        <p className="text-text-secondary">Welcome to the Buraq School Portal.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
