import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import api from '@/services/api';

/**
 * ForgotPassword — page to request a password reset link.
 */
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true);

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setStatus({ type: 'success', message: res.data.message || 'Reset link sent to your email.' });
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to send reset link. Please try again.'
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
                    Reset Password
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Enter your email address to receive a password reset link.
                </p>
            </div>

            {/* Status Message */}
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
                {/* Email */}
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email Address
                    </label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-text-muted"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-primary hover:text-secondary transition-colors">
                    ← Back to Sign In
                </Link>
            </div>
        </div>
    );
}
