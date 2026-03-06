import HeroSlider from '@/components/landing/HeroSlider';
import VisionSection from '@/components/landing/VisionSection';
import PerformanceSection from '@/components/landing/PerformanceSection';
import BranchesCarousel from '@/components/landing/BranchesCarousel';
import LeadershipSection from '@/components/landing/LeadershipSection';
import TextMarquee from '@/components/landing/TextMarquee';
import GallerySection from '@/components/landing/GallerySection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

/**
 * Landing — Buraq School public home page.
 * Composed of modular section components for easy management.
 */
export default function Landing() {
    return (
        <>
            <HeroSlider />
            <VisionSection />
            <PerformanceSection />
            <BranchesCarousel />
            <LeadershipSection />
            <TextMarquee />
            <GallerySection />
            <ContactSection />
            <Footer />
        </>
    );
}
