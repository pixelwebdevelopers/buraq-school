import useScrollReveal from '@/hooks/useScrollReveal';
import { FaQuoteLeft } from 'react-icons/fa';
import ceoImage from '@/assets/images/ceo_image.jpeg';
import directorImage from '@/assets/images/director_image.jpeg';

const LEADERS = [
    {
        name: 'Engineer Malik Farhan Ahmad Aadil',
        title: 'CEO & Founder',
        image: ceoImage,
        message:
            'Education is the most powerful tool we can use to build a brighter future. At Buraq School & College, we don\'t just teach subjects — we nurture dreams, build character, and shape leaders of tomorrow. Our commitment to providing quality education at the lowest fee structure stems from our belief that every child deserves access to excellence, regardless of their economic background. Together, we have built a community of achievers, and I am proud of every student who walks through our doors.',
    },
    {
        name: 'Director Buraq School',
        title: 'Director Academics',
        image: directorImage,
        message:
            'Our academic philosophy is centered on empowering students with knowledge, critical thinking skills, and moral values. The outstanding results our students consistently achieve in Federal Board examinations are a testament to the dedication of our teachers and the hard work of our students. We are committed to continuously improving our curriculum, teaching methodologies, and facilities to ensure that Buraq School remains at the forefront of academic excellence.',
    },
];

export default function LeadershipSection() {
    const sectionRef = useScrollReveal();

    return (
        <section className="relative overflow-hidden py-20 lg:py-28 bg-white">
            {/* Decorative */}
            <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-primary/5" />
            <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-secondary/5" />

            <div ref={sectionRef} className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                        Leadership
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                        Message from <span className="text-secondary">Our Leaders</span>
                    </h2>
                </div>

                {/* Leaders */}
                <div className="mt-14 space-y-16">
                    {LEADERS.map((leader, index) => (
                        <div
                            key={leader.name}
                            className={`group flex flex-col items-center gap-8 lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Image */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${index === 0 ? 'from-primary to-secondary' : 'from-secondary to-accent'
                                        } opacity-20 blur-lg transition-opacity group-hover:opacity-40`}
                                />
                                <div className="relative h-72 w-72 overflow-hidden rounded-3xl border-4 border-white shadow-xl sm:h-80 sm:w-80">
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                {/* Name Badge */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-dark rounded-xl px-5 py-2.5 text-center whitespace-nowrap">
                                    <p className="text-sm font-bold text-white">{leader.name}</p>
                                    <p className="text-[10px] text-white/60">{leader.title}</p>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="flex-1 rounded-3xl border border-border bg-surface p-8 shadow-sm lg:p-10">
                                <FaQuoteLeft className="mb-4 text-3xl text-primary/15" />
                                <p className="text-base leading-relaxed text-text-secondary italic lg:text-lg">
                                    "{leader.message}"
                                </p>
                                <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
