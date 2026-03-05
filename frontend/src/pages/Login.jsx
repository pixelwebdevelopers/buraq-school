import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Login — authentication page for the web portal.
 * Placeholder form; will be connected to backend in a future iteration.
 */
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-center text-xl font-bold text-text-primary">Sign In</h2>

            {error && (
                <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{error}</div>
            )}

            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-secondary">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-secondary">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    );
}
