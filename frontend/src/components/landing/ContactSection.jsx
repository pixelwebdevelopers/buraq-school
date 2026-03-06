import { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaWhatsapp,
    FaPaperPlane,
} from 'react-icons/fa';

const CONTACT_INFO = [
    {
        icon: FaPhoneAlt,
        label: 'Phone',
        value: '0310-8509645',
        href: 'tel:0310-8509645',
        color: 'bg-primary',
    },
    {
        icon: FaEnvelope,
        label: 'Email',
        value: 'buraqedn@gmail.com',
        href: 'mailto:buraqedn@gmail.com',
        color: 'bg-secondary',
    },
    {
        icon: FaWhatsapp,
        label: 'WhatsApp',
        value: '+92 310-8509645',
        href: 'https://wa.me/923108509645',
        color: 'bg-[#25D366]',
    },
    {
        icon: FaMapMarkerAlt,
        label: 'Address',
        value: 'Car Choke, Scheme-3, Chaklala, Rawalpindi',
        href: '#',
        color: 'bg-accent',
    },
];

export default function ContactSection() {
    const sectionRef = useScrollReveal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: integrate with backend
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <section id="contact" className="relative overflow-hidden bg-background py-20 lg:py-28">
            {/* Decorative */}
            <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/5" />
            <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-secondary/5" />

            <div ref={sectionRef} className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                        Get in Touch
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                        Contact <span className="text-secondary">Us</span>
                    </h2>
                    <p className="mt-4 text-base text-text-secondary">
                        Have questions about admissions, fee structure, or anything else? We&apos;re here to help.
                    </p>
                </div>

                <div className="mt-14 grid gap-8 lg:grid-cols-5">
                    {/* Contact Info Cards */}
                    <div className="space-y-4 lg:col-span-2">
                        {CONTACT_INFO.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div
                                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${item.color} text-white shadow-md transition-transform group-hover:scale-110`}
                                >
                                    <item.icon className="text-lg" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        {item.label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-text-primary">{item.value}</p>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
                        >
                            {submitted && (
                                <div className="mb-6 rounded-xl bg-success/10 p-4 text-center text-sm font-medium text-success">
                                    ✅ Thank you! Your message has been sent. We&apos;ll get back to you soon.
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0300-0000000"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Admission Inquiry"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="mb-1 block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Your message..."
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-light hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                            >
                                <FaPaperPlane />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
