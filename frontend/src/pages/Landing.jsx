/**
 * Landing — public home page for Buraq School.
 * Placeholder content; will be designed in a future iteration.
 */
export default function Landing() {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-white">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Welcome to Buraq School
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                        Empowering the next generation with quality education, modern teaching methods, and a
                        nurturing environment.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <a
                            href="/login"
                            className="rounded-lg bg-secondary px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-secondary-dark"
                        >
                            Login to Portal
                        </a>
                        <a
                            href="#about"
                            className="rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section Placeholder */}
            <section id="about" className="py-16">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary">About Buraq School</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-text-secondary">
                        Buraq School is dedicated to providing a holistic learning experience. Our web portal
                        gives students, parents, and staff seamless access to academic resources, schedules,
                        grades, and much more.
                    </p>
                </div>
            </section>
        </div>
    );
}
