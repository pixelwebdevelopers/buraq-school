import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSlider from '@/components/landing/HeroSlider';
import VisionSection from '@/components/landing/VisionSection';
import PerformanceSection from '@/components/landing/PerformanceSection';
import BranchesCarousel from '@/components/landing/BranchesCarousel';
import LeadershipSection from '@/components/landing/LeadershipSection';
import TextMarquee from '@/components/landing/TextMarquee';
import GallerySection from '@/components/landing/GallerySection';
import AffiliationSection from '@/components/landing/AffiliationSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';
import CampusMap from '@/components/landing/CampusMap';

/**
 * Landing — Buraq School public home page.
 * Composed of modular section components for easy management.
 */
export default function Landing() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                // Slight delay to ensure components are rendered
                const timeoutId = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [hash]);

    return (
        <>
            <HeroSlider />
            <VisionSection />
            <PerformanceSection />
            <BranchesCarousel />
            <CampusMap />
            <LeadershipSection />
            <TextMarquee />
            <GallerySection />
            <AffiliationSection />
            <ContactSection />
            <Footer />
        </>
    );
}
