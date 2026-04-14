import { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import resultsImage from '@/assets/images/results.jpeg';
import result1Image from '@/assets/images/Result1.jpeg';
import result2Image from '@/assets/images/Result2.jpeg';
import result3Image from '@/assets/images/Result3.jpeg';

export default function PerformanceSection() {
    const sectionRef = useScrollReveal();
    const [lightbox, setLightbox] = useState(null);

    const performanceImages = [
        {
            src: result1Image,
            alt: 'Buraq School Board Results Table',
            title: 'Detailed Board Performance',
            subtitle: 'Subject-wise Highest Marks & A+ Achievers'
        },
        {
            src: resultsImage,
            alt: 'Buraq School SSC Results 2025 — Federal Board Toppers',
            title: 'Excellent Federal Board SSC Results 2025',
            subtitle: '10th & 9th Class — All A+ Grades'
        },
        {
            src: result2Image,
            alt: 'Buraq School Academic Excellence',
            title: 'Outstanding Achievement',
            subtitle: 'Consistency in Higher Secondary Success'
        },
        {
            src: result3Image,
            alt: 'Buraq School Student Performance',
            title: 'Merit List Holders',
            subtitle: 'Celebrating our Top Performers'
        }
    ];

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
                <div className="mx-auto max-w-3xl text-center text-white mb-16">
                    <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary">
                        Outstanding Results
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Buraq School <span className="text-secondary">Performance</span>
                    </h2>
                    <p className="mt-4 text-base text-white/70 sm:text-lg">
                        Our students consistently achieve top grades in Federal Board SSC Examinations.
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative flex overflow-hidden">
                    <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap py-4">
                        {/* Duplicate the array to create a seamless loop */}
                        {[...performanceImages, ...performanceImages].map((img, index) => (
                            <div
                                key={index}
                                className="group relative mx-4 inline-block w-[220px] sm:w-[350px] lg:w-[400px] cursor-pointer overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:z-10 hover:scale-[1.02]"
                                onClick={() => setLightbox({ src: img.src, alt: img.alt })}
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/10 z-10" />
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="h-[350px] sm:h-[450px] lg:h-[550px] w-full object-contain bg-primary-dark/30 transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 inset-x-0 glass-dark p-6 z-20 text-wrap">
                                    <p className="text-base font-bold text-white mb-1">
                                        {img.title}
                                    </p>
                                    <p className="text-sm text-white/60">
                                        {img.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 animate-fade-in"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-6 right-6 text-3xl text-white/80 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <img
                        src={lightbox.src}
                        alt={lightbox.alt}
                        className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
