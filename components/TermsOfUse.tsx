import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfUseProps {
    onBack: () => void;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-black text-white pt-20 md:pt-36 pb-20">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <FileText size={32} className="text-emerald-500" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Terms of Use</h1>
                </div>

                <p className="text-gray-400 text-sm mb-12">Last Updated: February 2026</p>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Acceptance of Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            By accessing and using planetarybrief.com (the "Site"), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Site.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Intellectual Property</h2>
                        <p className="text-gray-300 leading-relaxed">
                            All content on this Site, including text, graphics, logos, and data, is the property of Planetary Brief or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Use License</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We grant you a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. This license does not include:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Commercial use or resale of Site content</li>
                            <li>Collection or use of product listings or descriptions</li>
                            <li>Derivative use of the Site or its content</li>
                            <li>Use of data mining, robots, or similar data gathering tools</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">User Conduct</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Use the Site for any unlawful purpose</li>
                            <li>Attempt to interfere with the Site's operation</li>
                            <li>Impersonate any person or entity</li>
                            <li>Transmit harmful code or viruses</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Disclaimer</h2>
                        <p className="text-gray-300 leading-relaxed">
                            The Site and its content are provided "as is" without warranties of any kind, either express or implied. Planetary Brief does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Planetary Brief shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Site.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact</h2>
                        <p className="text-gray-300 leading-relaxed">
                            For questions about these Terms of Use, please contact us at{' '}
                            <a href="mailto:legal@planetarybrief.com" className="text-emerald-500 hover:text-emerald-400">
                                legal@planetarybrief.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
