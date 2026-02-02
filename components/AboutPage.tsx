import React, { useEffect } from 'react';
import {
    Database, Cpu, ShieldCheck, FileCheck, Globe, BookOpen,
    Microscope, Newspaper, Radio, ArrowLeft, Activity,
    Layers, Search, Share2, Server
} from 'lucide-react';

interface AboutPageProps {
    onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-zinc-950 min-h-screen text-white pt-24 pb-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">

                {/* Header / Nav */}
                <button
                    onClick={onBack}
                    className="group mb-12 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={14} />
                    </div>
                    <span className="text-sm font-medium tracking-wide">Back to Brief</span>
                </button>

                {/* Hero Section */}
                <header className="mb-24 md:mb-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        System Online
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-8 leading-[0.9]">
                        Intelligence for a <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Changing Planet.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light border-l border-white/10 pl-6">
                        Planetary Brief is an experimental news engine blending <span className="text-white font-medium">NASA-grade data</span> with <span className="text-white font-medium">AI synthesis</span> to track the vital signs of Earth in real-time.
                    </p>
                </header>

                {/* The Mission - Manifesto Style */}
                <section className="mb-32 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4">
                        <div className="sticky top-24">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Our Mission</span>
                            <h2 className="text-2xl font-bold text-white mb-4">Signal in the Noise</h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                We live in the age of data overload. Our goal is to filter the flood of information into clarity, focusing only on the structural shifts that define our future.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-serif font-bold text-white mb-4">No Hype. No Doomstreaming.</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Environmental news often swings between apocalyptic panic and greenwashed optimism. We reject both.
                                We believe that clear, data-grounded reality—however stark—is the only foundation for meaningful action.
                            </p>
                        </div>
                        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-serif font-bold text-white mb-4">Rigorous Sourcing</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                We do not scrape social media. We do not aggregate opinion pieces.
                                Our inputs are strictly limited to peer-reviewed journals, government monitoring agencies (NOAA, NASA, ESA), and established scientific reporting.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Engine - Methodology Pipeline */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Intelligence Engine</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            How we turn raw planetary data into the briefing you read.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                            {[
                                {
                                    icon: Database,
                                    title: "Ingestion",
                                    desc: "Monitoring 50+ trusted scientific feeds daily.",
                                    color: "text-blue-400"
                                },
                                {
                                    icon: Cpu,
                                    title: "Synthesis",
                                    desc: "LLMs extract key findings & statistical trends.",
                                    color: "text-purple-400"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Verification",
                                    desc: "Fact-checking against source documents.",
                                    color: "text-emerald-400"
                                },
                                {
                                    icon: FileCheck,
                                    title: "Briefing",
                                    desc: "Structured, concise delivery to you.",
                                    color: "text-orange-400"
                                }
                            ].map((step, idx) => (
                                <div key={idx} className="group relative bg-black border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors ${step.color}`}>
                                        <step.icon size={24} />
                                    </div>
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Step 0{idx + 1}</div>
                                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Architecture - Source Grid */}
                <section>
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white">Trust Architecture</h2>
                            <p className="text-zinc-400 text-sm mt-1">Primary sources powering our consensus engine.</p>
                        </div>
                        <Globe className="text-zinc-600" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Scientific Bodies */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Server size={12} /> Scientific Bodies
                            </h3>
                            <div className="grid gap-2">
                                {["IPCC", "NASA Earth", "NOAA", "WMO", "Copernicus EU"].map(item => (
                                    <div key={item} className="px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-sm text-zinc-300 font-mono">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Journals */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <BookOpen size={12} /> Peer-Reviewed Journals
                            </h3>
                            <div className="grid gap-2">
                                {["Nature Climate", "Science Advances", "PLOS One", "Env. Research Letters"].map(item => (
                                    <div key={item} className="px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-sm text-zinc-300 font-mono">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={12} /> Analysis & Data
                            </h3>
                            <div className="grid gap-2">
                                {["Carbon Brief", "Our World in Data", "Global Carbon Project", "IEA"].map(item => (
                                    <div key={item} className="px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-sm text-zinc-300 font-mono">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer simple mark */}
                <div className="mt-32 pt-12 border-t border-white/5 text-center">
                    <p className="text-zinc-600 text-sm font-mono">
                        Planetary Brief v1.0 • Running on GreenShift Intelligence
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
