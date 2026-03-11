import useScrollReveal from '@/hooks/useScrollReveal';
import {
    FaSearch,
    FaBook,
    FaFileAlt,
    FaUsers,
    FaLightbulb,
    FaMapMarkedAlt,
    FaCheckCircle,
    FaCreditCard,
    FaHandshake,
    FaBuilding,
    FaUserPlus,
    FaHome,
    FaChalkboardTeacher,
    FaCogs,
    FaPhoneAlt
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

/**
 * FranchiseSection — Modern, grid-based display of the 14-step franchise process.
 */
export default function FranchiseSection() {
    const sectionRef = useScrollReveal();

    return (
        <section id="franchise" className="relative overflow-hidden bg-white py-20 lg:py-28">
            {/* Background elements */}
            <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />

            <div ref={sectionRef} className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary">
                        Partner with us
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                        Become a <span className="text-secondary">Franchise Owner</span>
                    </h2>
                    <p className="mt-4 text-base text-text-secondary">
                        Join the fastest-growing educational network. Follow our 14-step process to establish your own Buraq School branch.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {FRANCHISE_STEPS.map((step) => (
                        <div
                            key={step.id}
                            className="group relative flex flex-col items-center rounded-2xl border border-border bg-background p-4 sm:p-8 text-center transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Step Badge */}
                            <span className="absolute top-2 left-2 sm:top-4 sm:left-4 flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                Step {step.id}
                            </span>

                            {/* Icon container */}
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

                {/* CTA Section */}
                <div className="mt-20 flex flex-col items-center justify-center rounded-[2.5rem] bg-primary p-8 text-center text-white shadow-2xl sm:p-12 lg:flex-row lg:justify-between lg:text-left">
                    <div className="mb-8 lg:mb-0 lg:max-w-xl">
                        <h3 className="font-display text-2xl font-bold sm:text-3xl">
                            Ready to start your journey?
                        </h3>
                        <p className="mt-3 text-white/80">
                            Our team is available to answer all your questions and guide you through the process.
                        </p>
                    </div>
                    <a
                        href="tel:0310-8509645"
                        className="flex items-center gap-3 rounded-xl bg-secondary px-8 py-4 text-sm font-bold shadow-lg transition-all hover:bg-secondary-light hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                    >
                        <FaPhoneAlt className="animate-pulse" />
                        Contact Us Now
                    </a>
                </div>
            </div>
        </section>
    );
}
