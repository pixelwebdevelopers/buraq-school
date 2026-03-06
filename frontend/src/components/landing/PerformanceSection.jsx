import useScrollReveal from '@/hooks/useScrollReveal';
import resultsImage from '@/assets/images/results.jpeg';

export default function PerformanceSection() {
    const sectionRef = useScrollReveal();

    return (
        <section id="performance" className="relative overflow-hidden bg-primary py-20 lg:py-28">
            {/* Decorative */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
                <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-secondary/10" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div ref={sectionRef} className="reveal relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center text-white">
                    <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-light">
                        Outstanding Results
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Buraq School <span className="text-secondary">Performance</span>
                    </h2>
                    <p className="mt-4 text-base text-white/70 sm:text-lg">
                        Our students consistently achieve top grades in Federal Board SSC Examinations. Here are
                        our outstanding results from 2025.
                    </p>
                </div>

                {/* Results Content */}
                <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="glass rounded-2xl p-6 text-center text-white">
                            <p className="text-4xl font-extrabold text-secondary sm:text-5xl">1028</p>
                            <p className="mt-2 text-sm text-white/60">Highest Marks</p>
                            <p className="mt-1 text-xs font-semibold text-secondary-light">Aiman Saleem</p>
                        </div>
                        <div className="glass rounded-2xl p-6 text-center text-white">
                            <p className="text-4xl font-extrabold text-accent-light sm:text-5xl">1010</p>
                            <p className="mt-2 text-sm text-white/60">2nd Position</p>
                            <p className="mt-1 text-xs font-semibold text-accent-light">Noor-e-Haram</p>
                        </div>
                        <div className="glass rounded-2xl p-6 text-center text-white">
                            <p className="text-4xl font-extrabold text-white sm:text-5xl">50+</p>
                            <p className="mt-2 text-sm text-white/60">A+ Students</p>
                            <p className="mt-1 text-xs font-medium text-white/40">Class 9th & 10th</p>
                        </div>
                        <div className="glass rounded-2xl p-6 text-center text-white">
                            <p className="text-4xl font-extrabold text-secondary sm:text-5xl">100%</p>
                            <p className="mt-2 text-sm text-white/60">Pass Rate</p>
                            <p className="mt-1 text-xs font-medium text-white/40">All Campuses</p>
                        </div>
                    </div>

                    {/* Results Image */}
                    <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/10 z-10" />
                        <img
                            src={resultsImage}
                            alt="Buraq School SSC Results 2025 — Federal Board Toppers"
                            className="w-full max-h-[80vh] lg:max-h-[70vh] object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 inset-x-0 glass-dark p-4 z-20">
                            <p className="text-sm font-bold text-white">
                                Excellent Federal Board SSC Results 2025
                            </p>
                            <p className="text-xs text-white/60">
                                10th & 9th Class — All A+ Grades
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
