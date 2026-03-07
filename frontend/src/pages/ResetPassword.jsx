import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '@/services/api';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        if (formData.password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await api.post('/auth/reset-password', {
                token,
                newPassword: formData.password
            });
            setStatus({ type: 'success', message: res.data.message || 'Password reset successful!' });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to reset password. Token may have expired.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Heading */}
            <div className="mb-5 lg:mb-4">
                <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                    Create New Password
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Enter your new password below.
                </p>
            </div>

            {/* Status */}
            {status.message && (
                <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${status.type === 'error'
                        ? 'border-error/20 bg-error/5 text-error'
                        : 'border-green-500/20 bg-green-500/5 text-green-600'
                    }`}>
                    {status.message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-3">
                {/* New Password */}
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        New Password
                    </label>
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
                        >
                            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-12 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-text-muted"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || status.type === 'success'}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? 'Processing...' : 'Reset Password'}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-primary hover:text-secondary transition-colors">
                    ← Back to Sign In
                </Link>
            </div>
        </div>
    );
}
