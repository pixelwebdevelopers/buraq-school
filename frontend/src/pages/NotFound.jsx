import { Link } from 'react-router-dom';

/**
 * NotFound — 404 page for unmatched routes.
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="text-7xl font-extrabold text-primary">404</h1>
            <p className="mt-4 text-xl text-text-secondary">
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                to="/"
                className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light"
            >
                Go Back Home
            </Link>
        </div>
    );
}
