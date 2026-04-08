import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import studentsImage from '@/assets/images/students.png';

const SLIDES = [
    {
        id: 1,
        title: 'Shaping Future Leaders',
        subtitle: 'Excellence in Education Since 2012',
        description:
            'Buraq School & College provides world-class education with the lowest fee structure, empowering students to achieve extraordinary board results.',
        cta: 'Login to Portal',
        ctaLink: '/login',
        bgGradient: 'from-primary via-primary-dark to-[#0a0e3d]',
    },
    {
        id: 2,
        title: 'Federal Board Toppers',
        subtitle: 'SSC Results 2025 — A+ Achievers',
        description:
            'Our students consistently secure top positions in Federal Board examinations. 1028 marks — the highest score achieved by our brilliant students.',
        cta: 'View Results',
        ctaLink: '#performance',
        bgGradient: 'from-[#0f1654] via-primary to-primary-light',
    },
    {
        id: 3,
        title: 'Multiple Campuses',
        subtitle: 'Growing Across Rawalpindi',
        description:
            'With campuses at Car Choke, Rehmatabad, and Palm City — quality education is now accessible in your neighborhood.',
        cta: 'Our Branches',
        ctaLink: '#branches',
        bgGradient: 'from-primary-dark via-[#1a1060] to-primary',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goToSlide = useCallback(
        (index) => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrent(index);
            setTimeout(() => setIsAnimating(false), 700);
        },
        [isAnimating]
    );

    const nextSlide = useCallback(() => {
        goToSlide((current + 1) % SLIDES.length);
    }, [current, goToSlide]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const slide = SLIDES[current];

    return (
        <section id="home" className="relative overflow-hidden">
            {/* Background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-700`}
            />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 animate-float" />
                <div
                    className="absolute bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 animate-float"
                    style={{ animationDelay: '1.5s' }}
                />
                <div
                    className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-accent/10 animate-float"
                    style={{ animationDelay: '3s' }}
                />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Content — text only, left-aligned on desktop */}
            <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-4 sm:px-6 lg:px-10 pt-20 pb-[52vh] sm:pb-[55vh] lg:pb-20 sm:min-h-[90vh]">
                <div
                    key={slide.id}
                    className="w-full text-white animate-fade-in lg:w-1/2"
                >
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/90">
                        <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                        {slide.subtitle}
                    </div>

                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        {slide.title.split(' ').map((word, i) => (
                            <span key={i}>
                                {i === slide.title.split(' ').length - 1 ? (
                                    <span key={`typed-${current}`} className="text-secondary hero-typewriter">{word}</span>
                                ) : (
                                    word
                                )}{' '}
                            </span>
                        ))}
                    </h2>

                    <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                        {slide.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {slide.ctaLink.startsWith('/') ? (
                            <Link
                                to={slide.ctaLink}
                                className="group relative overflow-hidden rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span className="relative z-10">{slide.cta}</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-secondary-dark to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ) : (
                            <a
                                href={slide.ctaLink}
                                className="group relative overflow-hidden rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span className="relative z-10">{slide.cta}</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-secondary-dark to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>
                        )}
                        <a
                            href="#about"
                            className="rounded-xl glass px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>

            {/* Students Image — anchored to bottom edge of section */}
            <img
                src={studentsImage}
                alt="Buraq School Students"
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[5%] xl:right-[6%] h-[35vh] sm:h-[65vh] lg:h-[90vh] w-auto object-contain drop-shadow-2xl pointer-events-none"
            />

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-secondary' : 'w-2.5 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
