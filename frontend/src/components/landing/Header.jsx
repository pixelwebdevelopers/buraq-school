import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/images/logo.png';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '#about' },
    { label: 'Branches', href: '#branches' },
    { label: 'Franchise', href: '/franchise' },
    { label: 'Contact Us', href: '#contact' },
];

/**
 * Header — main navigation bar with logo, menu, and login button.
 * Sticky with glassmorphism effect on scroll.
 */
export default function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            setMobileOpen(false);
            const el = document.querySelector(href);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If on another page, go home first then scroll
                navigate('/' + href);
            }
        } else {
            setMobileOpen(false);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass-white shadow-lg'
                : 'bg-white shadow-sm'
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-3">
                    <img src={logo} alt="Buraq School" className="h-12 w-auto sm:h-14" />
                    <div className="flex flex-col">
                        <h1 className="text-base sm:text-xl font-bold leading-tight text-primary">
                            Buraq School <span className="text-secondary">&</span> College
                        </h1>
                        <p className="text-[10px] sm:text-xs font-medium tracking-wider text-text-secondary uppercase">
                            Affiliated with Federal Board
                        </p>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {NAV_LINKS.map((link) => (
                        link.href.startsWith('/') ? (
                            <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="relative px-4 py-2 text-base font-bold text-text-primary transition-colors hover:text-primary group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-secondary transition-all duration-300 group-hover:w-3/4 rounded-full" />
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="relative px-4 py-2 text-base font-bold text-text-primary transition-colors hover:text-primary group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-secondary transition-all duration-300 group-hover:w-3/4 rounded-full" />
                            </a>
                        )
                    ))}
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="ml-4 rounded-lg bg-secondary px-6 py-2.5 text-base font-semibold text-white shadow-md transition-all hover:bg-secondary-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="ml-4 rounded-lg bg-primary px-6 py-2.5 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Login
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-50 lg:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <HiX className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileOpen ? 'max-h-80 border-t border-border' : 'max-h-0'
                    }`}
            >
                <nav className="flex flex-col gap-1 px-4 py-4">
                    {NAV_LINKS.map((link) => (
                        link.href.startsWith('/') ? (
                            <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-50 hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="rounded-lg px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-50 hover:text-primary"
                            >
                                {link.label}
                            </a>
                        )
                    ))}
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="mt-2 rounded-lg bg-secondary px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-secondary-light"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-primary-light"
                        >
                            Login to Portal
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
