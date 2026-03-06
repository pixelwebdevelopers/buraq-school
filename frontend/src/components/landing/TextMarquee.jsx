/**
 * TextMarquee — continuous scrolling text banner with modern styling.
 */
export default function TextMarquee() {
    const text =
        '🎓 Free Admission Open — Pre-Medical • Pre-Engineering • I.C.S • Humanities — Upto 100% Fee Scholarships on Board Results — Million Rupees Cash Prizes for Board Position Holders — Free Coaching Classes for College Students — Examination Center for Girls — Short Hifz Course Available';

    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-primary py-5">
            {/* Overlay pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                }}
            />

            <div className="relative flex overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    <span className="mx-8 text-base font-semibold text-white sm:text-lg">
                        {text}
                    </span>
                    <span className="mx-8 text-base font-semibold text-white sm:text-lg">
                        {text}
                    </span>
                </div>
                <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
                    <span className="mx-8 text-base font-semibold text-white sm:text-lg">
                        {text}
                    </span>
                    <span className="mx-8 text-base font-semibold text-white sm:text-lg">
                        {text}
                    </span>
                </div>
            </div>
        </section>
    );
}
