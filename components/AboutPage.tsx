import React, { useEffect } from 'react';
import { Database, Cpu, ShieldCheck, FileCheck, Globe, BookOpen, Microscope, Newspaper, Radio, Heart, Users, TrendingUp } from 'lucide-react';

interface AboutPageProps {
    onBack: () => void;
}

const methodologySteps = [
    {
        icon: Database,
        title: "1. Global Data Ingestion",
        desc: "Our system continuously monitors high-integrity data streams from verified scientific institutions including NASA, the IPCC, NOAA, and peer-reviewed journals. We do not scrape social media or unverified blogs.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        icon: Cpu,
        title: "2. AI Synthesis & Analysis",
        desc: "Raw scientific reports are dense and often inaccessible. We utilize advanced Large Language Models (LLMs) to parse thousands of pages of technical documentation, extracting key findings, statistical trends, and actionable insights.",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        icon: ShieldCheck,
        title: "3. Verification Protocol",
        desc: "Every data point is cross-referenced against the original source material. Our 'Hallucination Check' layer ensures that figures, dates, and attributions match the primary source documents exactly.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
    },
    {
        icon: FileCheck,
        title: "4. Editorial Calibration",
        desc: "The final output is structured for clarity, stripping away jargon while retaining nuance. The result is a 'GreenShift Original'—a concise, accurate, and deeply researched report designed for the modern reader.",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    }
];

const sourceCategories = [
    {
        title: "Primary Scientific Bodies",
        icon: Globe,
        description: "Data & Assessments",
        items: [
            "Intergovernmental Panel on Climate Change (IPCC)",
            "World Meteorological Organization (WMO)",
            "United Nations Environment Programme (UNEP)",
            "NASA Earth / Climate",
            "National Oceanic and Atmospheric Administration (NOAA)",
            "European Environment Agency (EEA)",
            "Copernicus Climate Change Service"
        ]
    },
    {
        title: "Peer-Reviewed Journals",
        icon: BookOpen,
        description: "Academic Research",
        items: [
            "PLOS Climate",
            "Environmental Research Letters",
            "Science Advances"
        ]
    },
    {
        title: "Scientific Research Platforms",
        icon: Microscope,
        description: "Pre-prints & Databases",
        items: [
            "Google Scholar",
            "arXiv (Earth & Environmental Sciences)"
        ]
    },
    {
        title: "Science Journalism & Explainers",
        icon: Newspaper,
        description: "Deep Dives & Analysis",
        items: [
            "Carbon Brief",
            "ScienceDaily",
            "The Conversation",
            "Inside Climate News",
            "RealClimate",
            "Skeptical Science",
            "Climate Feedback"
        ]
    },
    {
        title: "General News Outlets",
        icon: Radio,
        description: "Strong Science/Environment Desks",
        items: [
            "Reuters",
            "Associated Press (AP News)",
            "National Geographic",
            "BBC News (Science & Environment)",
            "The Guardian (Environment)"
        ]
    }
];

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-44 md:pt-36 pb-24">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">

                {/* OUR MISSION SECTION */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                            Our Mission
                        </h1>
                        <div className="h-1 w-20 bg-news-accent mx-auto mb-8"></div>
                    </div>

                    <div className="space-y-8 text-gray-300 leading-relaxed max-w-3xl mx-auto text-lg md:text-xl font-light">
                        <p>
                            <span className="text-white font-medium">Planetary Brief</span> is an independent environmental intelligence publication covering climate, oceans, biodiversity and the systems that sustain life on Earth. We report with newsroom rigor, drawing exclusively on trusted science and established journalism.
                        </p>
                        <p>
                            Our goal is to make complex planetary change clear, relevant and engaging without exaggeration or alarmism. We translate research, data and expert reporting into stories that explain what is happening, why it matters, and how it connects to everyday life.
                        </p>
                        <p>
                            Planetary Brief is written for a generation living through rapid environmental change. We focus on the signals that matter most, grounding every article in evidence and clarity, and treating the state of the planet as the defining story of our time.
                        </p>
                    </div>
                </div>

                {/* METHODOLOGY SECTION */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                            How We Work
                        </h2>
                        <div className="h-1 w-20 bg-news-accent mx-auto mb-6"></div>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            GreenShift Intelligence is a hybrid of human editorial rigor and advanced AI infrastructure.
                            Every article you read here is the product of a multi-layered verification process.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {methodologySteps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`p-6 md:p-8 rounded-2xl ${step.bg} border ${step.borderColor} hover:scale-[1.02] transition-transform duration-300`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-zinc-950 border-2 ${step.borderColor} flex-shrink-0`}>
                                            <Icon size={28} className={step.color} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-xl md:text-2xl font-bold mb-3 ${step.color}`}>{step.title}</h3>
                                            <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center p-8 bg-zinc-900/50 border border-white/10 rounded-2xl">
                        <p className="text-gray-400 text-sm leading-relaxed">
                            <strong className="text-white">Transparency Note:</strong> We are not a primary research institution.
                            We synthesize, verify, and distribute findings from established scientific authorities. Our role is education, not original data generation.
                        </p>
                    </div>
                </div>

                {/* SOURCES SECTION */}
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
                            Trusted Sources
                        </h2>
                        <div className="h-1 w-20 bg-news-accent mx-auto mb-6"></div>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We curate knowledge from the world's most credible institutions. Below is a non-exhaustive list of sources
                            that inform our reporting.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {sourceCategories.map((category, idx) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-news-accent/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-news-accent/10 border border-news-accent/20">
                                            <Icon size={24} className="text-news-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{category.description}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-400">
                                                <span className="text-news-accent mt-1 flex-shrink-0">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
