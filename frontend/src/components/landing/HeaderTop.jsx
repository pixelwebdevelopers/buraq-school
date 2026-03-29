import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

/**
 * HeaderTop — top bar with contact info and social media icons.
 */
export default function HeaderTop() {
    return (
        <div className="bg-primary text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 py-2 text-xs sm:text-sm">
                {/* Contact Info */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <a
                        href="tel:0310-8509645"
                        className="flex items-center gap-1.5 transition-colors hover:text-accent-light"
                    >
                        <FaPhoneAlt className="text-[10px]" />
                        <span>0310-8509645</span>
                    </a>
                    <a
                        href="mailto:buraqedn@gmail.com"
                        className="hidden sm:flex items-center gap-1.5 transition-colors hover:text-accent-light"
                    >
                        <FaEnvelope className="text-[10px]" />
                        <span>buraqedn@gmail.com</span>
                    </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://www.facebook.com/share/18jYgBER5M/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-secondary hover:scale-110"
                    >
                        <FaFacebookF className="text-xs" />
                    </a>
                    <a
                        href="https://www.instagram.com/buraqschool_official?igsh=MXExdHVvcnAxcXVnbg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-secondary hover:scale-110"
                    >
                        <FaInstagram className="text-xs" />
                    </a>
                    <a
                        href="https://youtube.com/@buraqschool6166?si=PLomfq_4Olt9Ej0E"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-secondary hover:scale-110"
                    >
                        <FaYoutube className="text-xs" />
                    </a>
                    <a
                        href="https://wa.me/923108509645"
                        aria-label="WhatsApp"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-secondary hover:scale-110"
                    >
                        <FaWhatsapp className="text-xs" />
                    </a>
                </div>
            </div>
        </div>
    );
}
