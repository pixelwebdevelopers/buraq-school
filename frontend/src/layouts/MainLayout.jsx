import { Outlet } from 'react-router-dom';
import HeaderTop from '@/components/landing/HeaderTop';
import Header from '@/components/landing/Header';

/**
 * MainLayout — layout wrapper for public-facing pages.
 * Uses the new premium header with top bar.
 * Footer is included per-page (Landing has its own Footer component).
 */
export default function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <HeaderTop />
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
