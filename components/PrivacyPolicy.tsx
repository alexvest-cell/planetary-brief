import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-black text-white pt-36 pb-20">
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
                    <ShieldCheck size={32} className="text-emerald-500" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Privacy Policy</h1>
                </div>

                <p className="text-gray-400 text-sm mb-12">Last Updated: February 2026</p>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Introduction</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Planetary Brief ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website planetarybrief.com.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Information We Collect</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We may collect information about you in a variety of ways:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Personal Data (email address, name) when you subscribe to our newsletter</li>
                            <li>Usage Data (IP address, browser type, pages visited) via analytics tools</li>
                            <li>Cookies and tracking technologies for site functionality and analytics</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">How We Use Your Information</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Deliver our newsletter and editorial content</li>
                            <li>Improve our website and user experience</li>
                            <li>Analyze site traffic and usage patterns</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Data Sharing</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g., email platforms, analytics services) who assist in operating our website, subject to confidentiality agreements.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Your Rights</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Access and update your personal information</li>
                            <li>Unsubscribe from our newsletter at any time</li>
                            <li>Request deletion of your data (subject to legal requirements)</li>
                            <li>Object to processing of your data</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@planetarybrief.com" className="text-emerald-500 hover:text-emerald-400">
                                privacy@planetarybrief.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
