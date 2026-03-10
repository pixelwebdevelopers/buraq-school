import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Login — premium authentication page for the web portal.
 */
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
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
        <div>
            {/* Heading */}
            <div className="mb-5 lg:mb-4">
                <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl text-center">
                    Sign In
                </h2>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-error/10 text-xs">
                        !
                    </span>
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-3">
                {/* Identifier */}
                <div>
                    <label htmlFor="identifier" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email or Username
                    </label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            required
                            value={formData.identifier}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-text-muted"
                            placeholder="Email or Username"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Password
                        </label>
                        {/* <Link to="/forgot-password" className="text-xs font-medium text-primary transition-colors hover:text-secondary">
                            Forgot Password?
                        </Link> */}
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-12 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-text-muted"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-primary"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                    </div>
                </div>

                {/* Remember Me */}
                {/* <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-border text-primary accent-primary"
                    />
                    <label htmlFor="remember" className="text-sm text-text-secondary">
                        Remember me
                    </label>
                </div> */}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
            </form>

            {/* Divider */}
            <div className="my-5 lg:my-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-text-muted">OR</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-border bg-background/60 p-3 text-center">
                <p className="text-xs text-text-secondary">
                    Don&apos;t have an account?{' '}
                    <span className="font-semibold text-primary">
                        Contact your campus administration
                    </span>{' '}
                    to get your portal credentials.
                </p>
            </div>


        </div>
    );
}
