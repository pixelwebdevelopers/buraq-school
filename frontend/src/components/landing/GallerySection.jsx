import { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';

import gallery1 from '@/assets/gallery/gallery1.jpeg';
import gallery2 from '@/assets/gallery/gallery2.jpeg';
import gallery3 from '@/assets/gallery/gallery3.jpeg';
import gallery4 from '@/assets/gallery/gallery4.jpeg';
import gallery5 from '@/assets/gallery/gallery5.jpeg';
import gallery6 from '@/assets/gallery/gallery6.jpeg';
import gallery7 from '@/assets/gallery/gallery7.jpeg';
import gallery8 from '@/assets/gallery/gallery8.jpeg';
import gallery9 from '@/assets/gallery/gallery9.jpeg';

const IMAGES = [
    { src: gallery1, alt: 'Buraq School Activities' },
    { src: gallery2, alt: 'Classroom Learning' },
    { src: gallery3, alt: 'Student Achievement' },
    { src: gallery4, alt: 'School Events' },
    { src: gallery5, alt: 'Campus Life' },
    { src: gallery6, alt: 'Annual Functions' },
    { src: gallery7, alt: 'Sports Activities' },
    { src: gallery8, alt: 'Cultural Programs' },
    { src: gallery9, alt: 'Award Ceremony' },
    { src: gallery1, alt: 'Buraq School Activities' },
];

// Split into 2 rows for marquee on mobile
const ROW1 = IMAGES.slice(0, 5);
const ROW2 = IMAGES.slice(5);

export default function GallerySection() {
    const sectionRef = useScrollReveal();
    const [lightbox, setLightbox] = useState(null);

    return (
        <>
            <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-white to-background">
                <div ref={sectionRef} className="reveal">
                    {/* Header */}
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                            Gallery
                        </span>
                        <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                            Life at <span className="text-secondary">Buraq School</span>
                        </h2>
                        <p className="mt-4 text-base text-text-secondary">
                            A glimpse into our vibrant campus life, events, and celebrations.
                        </p>
                    </div>

                    {/* Desktop Grid */}
                    <div className="mx-auto mt-14 hidden max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 lg:px-10 sm:grid-cols-3 lg:grid lg:grid-cols-4 xl:grid-cols-5">
                        {IMAGES.map((img, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                onClick={() => setLightbox(index)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute bottom-0 inset-x-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                                    <p className="text-xs font-semibold text-white">{img.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Marquee Carousel */}
                    <div className="mt-14 space-y-3 lg:hidden overflow-hidden">
                        {/* Row 1 — scrolls left */}
                        <div className="flex animate-marquee hover:[animation-play-state:paused]">
                            {[...ROW1, ...ROW1].map((img, i) => (
                                <div
                                    key={`r1-${i}`}
                                    className="w-56 flex-shrink-0 px-1.5"
                                    onClick={() => setLightbox(i % ROW1.length)}
                                >
                                    <div className="aspect-square overflow-hidden rounded-2xl shadow-sm">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 2 — scrolls right (reverse) */}
                        <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
                            {[...ROW2, ...ROW2].map((img, i) => (
                                <div
                                    key={`r2-${i}`}
                                    className="w-56 flex-shrink-0 px-1.5"
                                    onClick={() => setLightbox(ROW1.length + (i % ROW2.length))}
                                >
                                    <div className="aspect-square overflow-hidden rounded-2xl shadow-sm">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-6 right-6 text-3xl text-white/80 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightbox((prev) => (prev > 0 ? prev - 1 : IMAGES.length - 1));
                        }}
                        className="absolute left-4 text-3xl text-white/60 hover:text-white transition-colors"
                        aria-label="Previous"
                    >
                        ‹
                    </button>
                    <img
                        src={IMAGES[lightbox].src}
                        alt={IMAGES[lightbox].alt}
                        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightbox((prev) => (prev < IMAGES.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-4 text-3xl text-white/60 hover:text-white transition-colors"
                        aria-label="Next"
                    >
                        ›
                    </button>
                    <p className="absolute bottom-6 text-sm text-white/60">
                        {lightbox + 1} / {IMAGES.length}
                    </p>
                </div>
            )}
        </>
    );
}
