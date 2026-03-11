import { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Footer from '@/components/landing/Footer';
import {
    FaSearch, FaBook, FaFileAlt, FaUsers, FaLightbulb, FaMapMarkedAlt,
    FaCheckCircle, FaCreditCard, FaHandshake, FaBuilding, FaUserPlus,
    FaHome, FaChalkboardTeacher, FaCogs, FaPhoneAlt, FaChevronDown,
    FaChartLine, FaGraduationCap, FaShieldAlt, FaBullhorn
} from 'react-icons/fa';

const FRANCHISE_STEPS = [
    { id: 1, title: 'Inquiry', icon: FaSearch, description: 'Initial contact and expressing interest in Buraq School franchise.' },
    { id: 2, title: 'Guide Book', icon: FaBook, description: 'Receive comprehensive guide book from Buraq Head Office.' },
    { id: 3, title: 'Application', icon: FaFileAlt, description: 'Submit formal application for franchise partnership.' },
    { id: 4, title: 'Meeting', icon: FaUsers, description: 'In-person or virtual meeting with the Buraq management team.' },
    { id: 5, title: 'Business Plan', icon: FaLightbulb, description: 'Detailed discussion on the proposed business and growth plan.' },
    { id: 6, title: 'Site Visit', icon: FaMapMarkedAlt, description: 'Physical inspection of the proposed location by Buraq officials.' },
    { id: 7, title: 'Approval', icon: FaCheckCircle, description: 'Formal approval of the franchise application and location.' },
    { id: 8, title: 'Payment', icon: FaCreditCard, description: 'Payment of the standard franchise fee to initiate setup.' },
    { id: 9, title: 'Agreement', icon: FaHandshake, description: 'Signing of the official Franchise Partnership Agreement.' },
    { id: 10, title: 'Infrastructure', icon: FaBuilding, description: 'Development and setup of school building and facilities.' },
    { id: 11, title: 'Hiring', icon: FaUserPlus, description: 'Recruitment of qualified teaching and administrative staff.' },
    { id: 12, title: 'Admissions', icon: FaHome, description: 'Launching admission campaigns and enrolling students.' },
    { id: 13, title: 'Training', icon: FaChalkboardTeacher, description: 'Comprehensive training for staff on Buraq School standards.' },
    { id: 14, title: 'Operations', icon: FaCogs, description: 'Official commencement of school operations and academics.' },
];

const BENEFITS = [
    { title: 'Proven Business Model', icon: FaChartLine, description: 'Successful track record across multiple branches ensures a secure investment.' },
    { title: 'Academic Excellence', icon: FaGraduationCap, description: 'Affiliated with Federal Board with a focus on holistic student development.' },
    { title: 'Full Support & Training', icon: FaShieldAlt, description: 'Complete assistance in staff recruitment, training, and operational setup.' },
    { title: 'Effective Marketing', icon: FaBullhorn, description: 'Strategic marketing support and localized branding for admission growth.' },
];

const FAQS = [
    { q: 'What is the initial investment required?', a: 'The initial investment varies based on location and infrastructure. Contact our franchise team for a detailed financial breakdown.' },
    { q: 'Do I need prior experience in the education sector?', a: 'While experience is an asset, our comprehensive training program and SOPs are designed to help partners from all backgrounds.' },
    { q: 'How long does it take to start operations?', a: 'Typically, it takes 3-6 months from agreement to launch, depending on the site readiness and recruitment.' },
    { q: 'What kind of ongoing support will I receive?', a: 'We provide continuous academic audits, teacher training workshops, and management support to ensure excellence.' },
];

export default function Franchise() {
    const revealRef = useScrollReveal();
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="flex flex-col pt-16 lg:pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary py-24 text-white lg:py-32">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-secondary-light blur-[100px]" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-secondary blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-4xl text-center ">
                        <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white bg-secondary">
                            Enterprise Opportunities
                        </span>
                        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                            Empower Tomorrow&apos;s Leaders with a <span className="text-secondary-light">Buraq Franchise</span>
                        </h1>
                        <p className="mt-6 text-lg text-white/80 sm:text-xl">
                            Join Pakistan&apos;s premier educational network. We provide the blueprint, you provide the passion. Let&apos;s build the future together.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <a href="tel:0310-8509645" className="rounded-xl bg-secondary px-8 py-4 text-sm font-bold shadow-lg transition-all hover:bg-secondary-light hover:shadow-xl hover:-translate-y-1">
                                Partner With Us
                            </a>
                            <a href="#process" className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/10">
                                Explore Process
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Us? (Benefits) */}
            <section className="bg-background py-20 lg:py-28">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                                Why Buraq?
                            </span>
                            <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl">
                                A Partner-First Approach to <span className="text-secondary">Educational Growth</span>
                            </h2>
                            <p className="mt-4 text-text-secondary">
                                Benefit from a brand that has already earned the trust of thousands of parents. We support our partners through every stage of their journey.
                            </p>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2">
                                {BENEFITS.map((benefit) => (
                                    <div key={benefit.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
                                            <benefit.icon className="text-xl" />
                                        </div>
                                        <h4 className="font-bold text-text-primary">{benefit.title}</h4>
                                        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                                            {benefit.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl">
                                <img src="/src/assets/images/hero_img.png" alt="Education" className="w-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 -z-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 14-Step Process Section */}
            <section id="process" className="bg-white py-20 lg:py-28">
                <div ref={revealRef} className="reveal container mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary">
                            The Roadmap
                        </span>
                        <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl">
                            Our Smooth <span className="text-secondary">14-Step Onboarding</span>
                        </h2>
                        <p className="mt-4 text-text-secondary">
                            We&apos;ve refined our process to ensure every new branch starts with excellence. Here is your journey to becoming a part of Buraq School.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {FRANCHISE_STEPS.map((step) => (
                            <div
                                key={step.id}
                                className="group relative flex flex-col items-center rounded-3xl border border-border bg-background p-4 sm:p-8 text-center transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                            >
                                <span className="absolute top-2 left-2 sm:top-4 sm:left-4 flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    Step {step.id}
                                </span>
                                <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <step.icon className="text-2xl sm:text-3xl text-primary" />
                                </div>
                                <h3 className="mb-1 sm:mb-2 font-display text-sm sm:text-lg font-bold text-text-primary">
                                    {step.title}
                                </h3>
                                <p className="text-[10px] sm:text-sm leading-relaxed text-text-secondary">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-background py-20 lg:py-28">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="text-center">
                        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
                            Common <span className="text-secondary">Questions</span>
                        </h2>
                        <p className="mt-4 text-text-secondary">Everything you need to know about the franchise opportunity.</p>
                    </div>

                    <div className="mt-12 space-y-4">
                        {FAQS.map((faq, idx) => (
                            <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:bg-white/80">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="flex w-full items-center justify-between p-5 text-left font-bold text-text-primary sm:p-6"
                                >
                                    <span>{faq.q}</span>
                                    <FaChevronDown className={`transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 border-t border-border/50 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="p-5 text-sm leading-relaxed text-text-secondary sm:p-6">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-white py-20">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <div className="flex flex-col items-center justify-center rounded-[3rem] bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-white shadow-2xl lg:p-16">
                        <div className="max-w-2xl">
                            <h2 className="font-display text-3xl font-bold sm:text-4xl">
                                Start Your Educational Entrepreneurship Today
                            </h2>
                            <p className="mt-6 text-white/80">
                                Join our network and make a real difference in your community while building a successful business.
                            </p>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <a href="tel:0310-8509645" className="flex items-center gap-3 rounded-2xl bg-secondary px-10 py-5 font-bold shadow-xl transition-all hover:bg-secondary-light hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
                                    <FaPhoneAlt className="animate-pulse" />
                                    Launch Your Branch
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
