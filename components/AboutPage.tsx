import React, { useEffect } from 'react';

interface AboutPageProps {
    onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-zinc-950 min-h-screen text-white pt-20 md:pt-40 pb-24 relative overflow-hidden font-sans">
            <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">

                {/* SECTION 1 — HERO */}
                <header className="mb-20">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
                        Environmental Intelligence. <br className="hidden md:block" />
                        <span className="text-zinc-500">Structured.</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed italic border-l-4 border-news-accent pl-4 mb-8">
                        Independent, evidence-grounded analysis across climate systems, biodiversity, governance, technology, and planetary health.
                    </p>

                    <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm md:text-base">
                        <p>
                            Planetary Brief is a structured environmental intelligence platform. We monitor institutional datasets, scientific literature, and policy developments to provide clear, categorized analysis. Our methodology ensures that complex planetary data is synthesized into standardized formats, allowing for comparability, clarity, and uncompromising accuracy.
                        </p>
                    </div>
                </header>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 2 — Editorial Mandate */}
                <section className="mb-20 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">Editorial Mandate</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm md:text-base">
                            <p className="mb-6">
                                All intelligence published by Planetary Brief is mapped to a controlled taxonomy to ensure institutional consistency and analytical clarity. This structure prevents narrative drift and ensures environmental data remains accessible and directly comparable.
                            </p>

                            <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Sector Hubs</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 list-none pl-0">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Climate & Energy Systems</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Biodiversity & Oceans</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Policy, Governance & Finance</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Science & Data</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Technology & Innovation</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Planetary Health & Society</li>
                            </ul>

                            <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Intelligence Formats</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0">
                                <li className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span> Policy Brief</li>
                                <li className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span> Data Signal</li>
                                <li className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span> Treaty Explainer</li>
                                <li className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span> Technology Assessment</li>
                                <li className="flex items-center gap-2 text-zinc-400"><span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span> In-Depth Analysis</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 3 — Intelligence Architecture */}
                <section className="mb-20 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">Intelligence Architecture</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <div className="space-y-6">
                            {[
                                {
                                    step: "01",
                                    title: "Source Monitoring",
                                    desc: "Daily monitoring of scientific bodies, multilateral institutions, empirical datasets, and peer-reviewed literature."
                                },
                                {
                                    step: "02",
                                    title: "Data Synthesis",
                                    desc: "Automated monitoring and computational synthesis systems support editorial analysis, enabling quantitative trend identification and cross-institutional comparison."
                                },
                                {
                                    step: "03",
                                    title: "Editorial Verification",
                                    desc: "Rigorous source validation, cross-referencing, and contextualization of data points against historical baselines."
                                },
                                {
                                    step: "04",
                                    title: "Structured Briefing",
                                    desc: "Publication and dissemination in standardized intelligence formats optimized for clarity and rapid comprehension."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="text-news-accent font-mono font-bold text-sm mt-0.5">{item.step}</div>
                                    <div>
                                        <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                        <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 4 — Governance & Source Integrity */}
                <section className="mb-20 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">Source Governance</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm md:text-base">
                            <p className="mb-6">
                                Planetary Brief relies exclusively on authoritative, institutional, and peer-reviewed sources. There are no anonymous claims and no speculative framing. All analysis is strictly traceable to documented origins.
                            </p>

                            <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Primary Monitored Institutions</h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                {["IPCC", "NASA", "NOAA", "Copernicus", "IEA", "Global Carbon Project", "WHO"].map(item => (
                                    <div key={item} className="px-3 py-2 bg-black border border-white/10 rounded text-xs text-zinc-300 font-mono text-center">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-zinc-500 italic">
                                * In addition to major peer-reviewed scientific journals across earth systems and environmental disciplines.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 5 — PlanetDash System */}
                <section className="mb-20 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">PlanetDash Monitoring Framework</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-6">
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm md:text-base">
                            <p className="mb-6">
                                The PlanetDash system tracks core planetary indicators across environmental sectors. It exists to provide a persistent, real-time reflection of the most current institutional data, rather than predictive modeling.
                            </p>

                            <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Tracked Indicators Include</h3>
                            <ul className="grid grid-cols-1 gap-3 list-none pl-0 text-zinc-400">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Atmospheric CO₂ Concentrations
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Global Temperature Anomalies
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Ocean Heat Content
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Renewable Energy Capacity Additions
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Deforestation Rates
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20"></div>
                                    Carbon Pricing Coverage
                                </li>
                            </ul>

                            <p className="mt-8 text-sm text-zinc-500 bg-white/5 p-4 rounded border-l-2 border-zinc-500">
                                Indicators are updated asynchronously as authoritative datasets release new figures. System snapshot timestamps indicate the most recent synchronization.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 6 — Institutional Positioning */}
                <section className="mb-20 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">Positioning</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm md:text-base bg-black border border-white/10 p-6 md:p-8 rounded-lg">
                            <p>
                                Planetary Brief operates exclusively at the intersection of scientific monitoring, policy interpretation, and systems-level environmental analysis.
                            </p>
                            <p className="mt-4 font-bold text-white">
                                Planetary Brief is not an advocacy organization. It does not campaign. It interprets.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-white/10 my-16"></div>

                {/* SECTION 7 — Contact & Transparency */}
                <section className="mb-24 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">Transparency & Contact</h2>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2 text-zinc-500">Contact</h3>
                                <p className="text-sm text-zinc-300 mb-2">Editorial Inquiries & Institutional Collaboration:</p>
                                <a href="mailto:intelligence@planetarybrief.com" className="text-news-accent hover:underline text-sm font-mono">intelligence@planetarybrief.com</a>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2 text-zinc-500">Corrections Policy</h3>
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    Planetary Brief is committed to factual precision. Material errors in data or interpretation are corrected transparently, with appendums noting the date and nature of the revision on the respective brief.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutPage;
