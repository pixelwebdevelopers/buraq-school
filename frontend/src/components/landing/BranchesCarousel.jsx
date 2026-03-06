import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import useScrollReveal from '@/hooks/useScrollReveal';

const BRANCHES = [
    {
        id: 1,
        name: 'Main Campus',
        location: 'Car Choke, Scheme-3, Chaklala, Rawalpindi',
        phone: '0312-5169321',
        phone2: '0336-5114014',
        color: 'from-primary to-primary-light',
        features: ['Complete School & College', 'Federal Board', 'Examination Center'],
    },
    {
        id: 2,
        name: 'E-Rehmatabad Campus',
        location: 'E-Block Rehmatabad, Chaklala, Rawalpindi',
        phone: '0334-5817084',
        color: 'from-secondary-dark to-secondary',
        features: ['School Section', 'Federal Board', 'Co-Education'],
    },
    {
        id: 3,
        name: 'A-Rehmatabad Campus',
        location: 'Opp. Govt. Girls High School, Rehmatabad, Chaklala, Rwp.',
        phone: '0311-5373723',
        color: 'from-[#0891b2] to-[#06b6d4]',
        features: ['School Section', 'Federal Board', 'Quality Education'],
    },
    {
        id: 4,
        name: 'Palm City Campus',
        location: 'Jaba Palm City, Chaklala, Rawalpindi',
        phone: '0347-5749160',
        color: 'from-accent-dark to-accent',
        features: ['School Section', 'Federal Board', 'Modern Facilities'],
    },
];

// Double the items for seamless infinite loop
const LOOP_ITEMS = [...BRANCHES, ...BRANCHES];

function BranchCard({ branch }) {
    return (
        <div className="w-[320px] flex-shrink-0 px-3 sm:w-[360px]">
            <div className="h-full rounded-2xl border border-border bg-surface p-1 shadow-sm">
                {/* Colored Header */}
                <div className={`rounded-xl bg-gradient-to-r ${branch.color} p-5 text-white`}>
                    <h3 className="text-xl font-bold">{branch.name}</h3>
                    <div className="mt-3 flex items-start gap-2 text-sm text-white/80">
                        <FaMapMarkerAlt className="mt-0.5 flex-shrink-0 text-xs" />
                        <span>{branch.location}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <FaPhoneAlt className="text-xs text-primary" />
                        <span className="font-medium">{branch.phone}</span>
                        {branch.phone2 && <span className="text-text-muted">/ {branch.phone2}</span>}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {branch.features.map((feat) => (
                            <span
                                key={feat}
                                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary"
                            >
                                {feat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BranchesCarousel() {
    const sectionRef = useScrollReveal();

    return (
        <section
            id="branches"
            className="relative overflow-hidden bg-gradient-to-b from-background to-white py-20 lg:py-28"
        >
            <div ref={sectionRef} className="reveal">
                {/* Header */}
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                        Our Campuses
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                        Branches Across <span className="text-secondary">Rawalpindi</span>
                    </h2>
                    <p className="mt-4 text-base text-text-secondary">
                        Quality education accessible in your neighborhood — 4 campuses, one standard of
                        excellence.
                    </p>
                </div>

                {/* Infinite Auto-Scroll Carousel */}
                <div className="mt-14 overflow-hidden">
                    <div className="flex animate-marquee [animation-duration:30s] sm:[animation-duration:30s] max-sm:[animation-duration:15s] hover:[animation-play-state:paused]">
                        {LOOP_ITEMS.map((branch, i) => (
                            <BranchCard key={`${branch.id}-${i}`} branch={branch} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
