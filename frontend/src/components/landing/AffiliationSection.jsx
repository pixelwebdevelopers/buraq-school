import abu from '@/assets/affiliation/abu.png';
import aeo from '@/assets/affiliation/aeo.png';
import aue from '@/assets/affiliation/aue.png';
import britishCouncil from '@/assets/affiliation/british-council.png';
import riphah from '@/assets/affiliation/riphah.png';
import superior from '@/assets/affiliation/superior.png';

const INSTITUTES = [
    { name: 'Abu Dhabi University', logo: abu },
    { name: 'AEO Pakistan', logo: aeo },
    { name: 'American University in the Emirates', logo: aue },
    { name: 'British Council', logo: britishCouncil },
    { name: 'Riphah International University', logo: riphah },
    { name: 'Superior University', logo: superior },
];

/**
 * AffiliationSection — Continuous logo marquee for affiliated institutes.
 */
export default function AffiliationSection() {
    // Duplicate for seamless loop
    const displayInstitutes = [...INSTITUTES, ...INSTITUTES, ...INSTITUTES];

    return (
        <section className="bg-white py-12 lg:py-16 border-t border-border/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="text-center mb-10">
                    <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                        Affiliated <span className="text-secondary">Institutes</span>
                    </h2>
                    <div className="mt-2 mx-auto h-1 w-20 rounded-full bg-secondary/20" />
                </div>

                <div className="relative flex overflow-hidden">
                    {/* Marquee Container */}
                    <div className="flex animate-marquee whitespace-nowrap items-center">
                        {displayInstitutes.map((inst, idx) => (
                            <div 
                                key={`${inst.name}-${idx}`}
                                className="mx-8 flex h-20 w-40 items-center justify-center transition-all hover:scale-105"
                            >
                                <img 
                                    src={inst.logo} 
                                    alt={inst.name} 
                                    className="max-h-full max-w-full object-contain transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Gradient Overlays for smooth edges */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
                </div>
            </div>
        </section>
    );
}
