import { Outlet, Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';

/**
 * AuthLayout — premium split-screen layout for authentication pages.
 * Left: Branding panel with animated decorations.
 * Right: Auth form content.
 */
export default function AuthLayout() {
    return (
        <div className="flex min-h-screen">
            {/* ── Left Branding Panel ── */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#080b3a] lg:flex lg:flex-col lg:items-center lg:justify-center">
                {/* Animated Decorative Circles */}
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/5 animate-float" />
                <div
                    className="absolute bottom-20 -right-16 h-64 w-64 rounded-full bg-secondary/10 animate-float"
                    style={{ animationDelay: '2s' }}
                />
                <div
                    className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-accent/8 animate-float"
                    style={{ animationDelay: '4s' }}
                />
                <div className="absolute bottom-1/4 left-1/4 h-24 w-24 rounded-full bg-white/5 animate-float"
                    style={{ animationDelay: '1s' }}
                />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center text-white animate-fade-in">
                    <img src={logo} alt="Buraq School" className="h-20 w-auto drop-shadow-xl" />

                    <h1 className="mt-5 font-display text-3xl font-bold leading-tight">
                        Welcome to<br />
                        <span className="text-secondary">Buraq School</span> Portal
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                        Access your academic dashboard, results, schedules, and more — all in one place.
                    </p>

                    {/* Stats Row */}
                    <div className="mt-6 flex gap-5">
                        <div className="glass rounded-xl px-5 py-3 text-center">
                            <p className="text-xl font-bold text-secondary">12+</p>
                            <p className="text-[10px] text-white/50">Years</p>
                        </div>
                        <div className="glass rounded-xl px-5 py-3 text-center">
                            <p className="text-xl font-bold text-secondary">4</p>
                            <p className="text-[10px] text-white/50">Campuses</p>
                        </div>
                        <div className="glass rounded-xl px-5 py-3 text-center">
                            <p className="text-xl font-bold text-secondary">A+</p>
                            <p className="text-[10px] text-white/50">Results</p>
                        </div>
                    </div>
                </div>

                {/* Bottom link */}
                <div className="absolute bottom-8 z-10">
                    <Link
                        to="/"
                        className="text-sm text-white/40 transition-colors hover:text-white/80"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-6 lg:w-1/2 lg:overflow-hidden lg:h-screen">
                {/* Mobile logo (hidden on lg) */}
                <div className="mb-8 flex flex-col items-center lg:hidden">
                    <img src={logo} alt="Buraq School" className="h-16 w-auto" />
                    <h1 className="mt-3 font-display text-xl font-bold text-primary">
                        Buraq School <span className="text-secondary">Portal</span>
                    </h1>
                </div>

                {/* Form container */}
                <div className="w-full max-w-md animate-slide-up">
                    <Outlet />
                </div>

                {/* Mobile back link */}
                <Link
                    to="/"
                    className="mt-8 text-sm text-text-muted transition-colors hover:text-primary lg:hidden"
                >
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
}
