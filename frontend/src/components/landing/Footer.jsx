import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaChevronRight,
} from 'react-icons/fa';
import logo from '@/assets/images/logo.png';
import pixelLogo from '@/assets/images/pixel-web-dev-logo.png';

const QUICK_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Results', href: '#performance' },
    { label: 'Branches', href: '#branches' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact Us', href: '#contact' },
];

const PROGRAMS = [
    'Pre-Medical',
    'Pre-Engineering',
    'I.C.S',
    'Humanities (Arts)',
    'Short Hifz Course',
    'Federal Board SSC',
];

export default function Footer() {
    const handleLinkClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="relative overflow-hidden bg-primary text-white">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />

            {/* Decorative */}
            <div className="absolute -top-20 right-20 h-72 w-72 rounded-full bg-white/3" />
            <div className="absolute bottom-10 -left-10 h-48 w-48 rounded-full bg-white/3" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Buraq School" className="h-14 w-auto" />
                            <div>
                                <h3 className="text-lg font-bold">Buraq School</h3>
                                <p className="text-xs text-white/50">& College (Regd)</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-white/60">
                            The largest educational system with the lowest fee structure. Affiliated with the
                            Federal Board. Producing excellent board results for over 12 years.
                        </p>
                        {/* Social */}
                        <div className="mt-6 flex gap-3">
                            {[
                                { icon: FaFacebookF, href: 'https://www.facebook.com/share/18jYgBER5M/', label: 'Facebook' },
                                { icon: FaInstagram, href: 'https://www.instagram.com/buraqschool_official?igsh=MXExdHVvcnAxcXVnbg==', label: 'Instagram' },
                                { icon: FaYoutube, href: 'https://youtube.com/@buraqschool6166?si=PLomfq_4Olt9Ej0E', label: 'YouTube' },
                                { icon: FaWhatsapp, href: 'https://wa.me/923108509645', label: 'WhatsApp' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm transition-all hover:bg-secondary hover:scale-110"
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">
                            Quick Links
                        </h4>
                        <div className="mt-1 h-0.5 w-8 rounded-full bg-secondary" />
                        <ul className="mt-4 space-y-2.5">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-secondary"
                                    >
                                        <FaChevronRight className="text-[8px] transition-transform group-hover:translate-x-1" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/login"
                                    className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-secondary"
                                >
                                    <FaChevronRight className="text-[8px] transition-transform group-hover:translate-x-1" />
                                    Portal Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">Programs</h4>
                        <div className="mt-1 h-0.5 w-8 rounded-full bg-secondary" />
                        <ul className="mt-4 space-y-2.5">
                            {PROGRAMS.map((prog) => (
                                <li key={prog} className="flex items-center gap-2 text-sm text-white/60">
                                    <FaChevronRight className="text-[8px]" />
                                    {prog}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">
                            Contact Us
                        </h4>
                        <div className="mt-1 h-0.5 w-8 rounded-full bg-secondary" />
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a
                                    href="tel:0310-8509645"
                                    className="flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-secondary"
                                >
                                    <FaPhoneAlt className="mt-0.5 flex-shrink-0 text-xs text-secondary" />
                                    <span>0310-8509645 / 0336-5114014</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:buraqedn@gmail.com"
                                    className="flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-secondary"
                                >
                                    <FaEnvelope className="mt-0.5 flex-shrink-0 text-xs text-secondary" />
                                    <span>buraqedn@gmail.com</span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-xs text-secondary" />
                                <span>Car Choke, Scheme-3, Chaklala, Rawalpindi</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row">
                    <p className="text-xs text-white/40">
                        &copy; {new Date().getFullYear()} Buraq School & College. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-white/40">Developed by</p>
                        <a
                            href="https://pixelwebdevelopers.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 group"
                        >
                            <img src={pixelLogo} alt="Pixel Web Developers" className="h-5 w-auto rounded-sm group-hover:opacity-80 transition-opacity" />
                            <span className="text-xs font-semibold text-white  transition-colors">
                                Pixel Web Developers
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
