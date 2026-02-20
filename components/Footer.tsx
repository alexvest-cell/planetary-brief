import React from 'react';
import { CATEGORIES } from '../data/categories';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
    onCategoryClick: (category: string) => void;
    onShowAbout: () => void;
    onDashboardClick: () => void;
    onSubscribeClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onCategoryClick, onShowAbout, onDashboardClick, onSubscribeClick }) => {
    const categoryToSlug = (category: string): string => {
        return category
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <footer className="w-full bg-black border-t border-white/10">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-8 pt-12 pb-8 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-8">

                    {/* Column 1: Core Topic Hubs (Primary SEO Block) */}
                    <div>
                        <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">
                            Intelligence by Sector
                        </h3>
                        <nav className="space-y-3">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => onCategoryClick(category.id)}
                                    className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200 text-left"
                                >
                                    {category.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Column 2: Editorial & Resources */}
                    <div>
                        <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">
                            Resources
                        </h3>
                        <nav className="space-y-3">
                            <button
                                onClick={onShowAbout}
                                className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200 text-left"
                            >
                                About Planetary Brief
                            </button>
                            <a
                                href="mailto:contact@planetarybrief.com"
                                className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200"
                            >
                                Contact
                            </a>
                            <button
                                onClick={onSubscribeClick}
                                className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200 text-left"
                            >
                                Newsletter
                            </button>
                            <div className="border-t border-white/5 my-4 pt-4 space-y-3">
                                <button
                                    onClick={onDashboardClick}
                                    className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200 text-left"
                                >
                                    Data Signals
                                </button>
                                <a
                                    href="/#analysis"
                                    className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200"
                                >
                                    In-Depth Analysis
                                </a>
                                <span className="block text-gray-600 text-xs md:text-sm cursor-not-allowed">
                                    Policy Tracker <span className="text-[8px] md:text-[10px] text-gray-700">(Coming Soon)</span>
                                </span>
                                <a
                                    href="/archives"
                                    className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200"
                                >
                                    Archives
                                </a>
                            </div>
                        </nav>
                    </div>

                    {/* Column 3: Newsletter + About Summary */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-6">
                            Stay Informed
                        </h3>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                            Translating complex scientific data into actionable intelligence for a changing world.
                        </p>

                        {/* Newsletter CTA */}
                        <button
                            onClick={onSubscribeClick}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-200 text-xs md:text-sm mb-6 md:mb-8"
                        >
                            Subscribe to Newsletter
                        </button>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com/planetarybrief"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                                title="Instagram"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=61587322058668"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                                title="Facebook"
                            >
                                <Facebook size={16} />
                            </a>
                            <a
                                href="https://x.com/planetarybrief"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                                title="X (Twitter)"
                            >
                                <Twitter size={16} />
                            </a>
                            <a
                                href="https://linkedin.com/company/planetarybrief"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                                title="LinkedIn"
                            >
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Legal + Copyright */}
            <div className="border-t border-white/5">
                <div className="container mx-auto px-4 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-gray-600">
                        {/* Legal Links */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <a href="/privacy" className="hover:text-gray-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="/terms" className="hover:text-gray-400 transition-colors">
                                Terms of Use
                            </a>
                            <a href="/sitemap.xml" className="hover:text-gray-400 transition-colors">
                                Sitemap
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="text-center md:text-right">
                            <p>© {new Date().getFullYear()} Planetary Brief — Planetary Intelligence for a Changing World</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
