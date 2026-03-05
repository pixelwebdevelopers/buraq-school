import { Outlet } from 'react-router-dom';

/**
 * MainLayout — layout wrapper for public-facing pages (landing, about, etc.)
 * Will include shared Navbar and Footer.
 */
export default function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* TODO: Add Navbar component */}
            <header className="bg-primary text-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <h1 className="text-xl font-bold">Buraq School</h1>
                    <nav className="flex items-center gap-6">
                        {/* Navigation links will go here */}
                    </nav>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* TODO: Add Footer component */}
            <footer className="bg-primary-dark py-6 text-center text-sm text-white/70">
                &copy; {new Date().getFullYear()} Buraq School. All rights reserved.
            </footer>
        </div>
    );
}
