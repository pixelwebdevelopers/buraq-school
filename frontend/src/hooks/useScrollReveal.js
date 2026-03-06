import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — Intersection Observer hook for scroll-triggered reveal animations.
 * Adds 'visible' class when element enters viewport.
 */
export default function useScrollReveal(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: options.threshold || 0.15,
                rootMargin: options.rootMargin || '0px 0px -50px 0px',
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin]);

    return ref;
}
