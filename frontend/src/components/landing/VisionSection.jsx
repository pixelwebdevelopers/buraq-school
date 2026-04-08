import useScrollReveal from '@/hooks/useScrollReveal';
import { FaGraduationCap, FaBookOpen, FaGlobe, FaHeart } from 'react-icons/fa';

const PILLARS = [
    {
        icon: FaGraduationCap,
        title: 'Academic Excellence',
        description: 'Consistently producing Federal Board toppers with A+ grades in 9th and 10th.',
    },
    {
        icon: FaBookOpen,
        title: 'Holistic Learning',
        description: 'Combining academic rigor with Hifz courses and essential character development.',
    },
    {
        icon: FaGlobe,
        title: 'Modern Curriculum',
        description: 'Up-to-date teaching methods aligned with international educational standards.',
    },
    {
        icon: FaHeart,
        title: 'Nurturing Environment',
        description: 'A safe and inspiring space where every student feels valued and motivated.',
    },
];

export default function VisionSection() {
    const sectionRef = useScrollReveal();

    return (
        <section id="about" className="relative overflow-hidden py-20 lg:py-28">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-secondary/5 translate-y-1/2 -translate-x-1/2" />

            <div ref={sectionRef} className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                        Our Vision
                    </span>
                    <h2 className="mt-4 font-display text-xl font-bold text-primary whitespace-nowrap sm:text-3xl md:text-4xl lg:text-5xl">
                        Empowering Minds,{' '}
                        <span className="text-secondary">Building Futures</span>
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-text-secondary sm:text-lg">
                        At Buraq School & College, our vision is to be the leading educational institution that
                        transforms young minds into responsible, knowledgeable, and compassionate leaders. We
                        believe in making quality education accessible to all through the lowest fee structure
                        while maintaining the highest academic standards. For over 18 years, we have been
                        nurturing excellence and shaping the future of our nation.
                    </p>
                </div>

                {/* Pillars Grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {PILLARS.map((pillar, index) => (
                        <div
                            key={pillar.title}
                            className="group rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/20"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white shadow-md transition-transform group-hover:scale-110">
                                <pillar.icon className="text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-primary">{pillar.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
