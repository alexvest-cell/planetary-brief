import React, { useEffect } from 'react';
import { ArrowLeft, Database, Cpu, ShieldCheck, FileCheck, Globe2, BrainCircuit } from 'lucide-react';

interface MethodologyViewProps {
  onBack: () => void;
}

const steps = [
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

const MethodologyView: React.FC<MethodologyViewProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-32 pb-24">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 font-medium text-xs tracking-widest uppercase"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-news-accent transition-colors">
            <ArrowLeft size={16} />
          </div>
          Return to Report
        </button>

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-news-accent font-bold uppercase tracking-widest text-xs mb-6 border border-news-accent/30 px-4 py-1.5 rounded-full bg-news-accent/5">
            <BrainCircuit size={14} />
            <span>Intelligence Architecture</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
            Who Wrote This? <br />
            <span className="text-gray-500">We Built a Better Way to Learn.</span>
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
             In an era of clickbait and misinformation, we believe the solution isn't just more writers—it's better systems. GreenShift combines the processing power of AI with the rigor of scientific verification.
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-orange-500/50 hidden md:block"></div>

            <div className="space-y-12">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col md:flex-row gap-8 group">
                        {/* Icon Node */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border ${step.borderColor} ${step.bg} ${step.color} z-10 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                            <step.icon size={32} strokeWidth={1.5} />
                        </div>

                        {/* Content Card */}
                        <div className="flex-grow bg-zinc-900/40 border border-white/10 rounded-xl p-8 hover:bg-zinc-900/60 transition-colors backdrop-blur-sm">
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-3 ${step.color}`}>{step.title}</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Philosophy / Reassurance */}
        <div className="mt-24 bg-white/5 border border-white/10 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-news-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <Globe2 size={48} className="text-white mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-serif font-bold text-white mb-6">Why This Matters</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                Traditional environmental reporting is often too slow to keep up with the crisis, or too technical for the average reader. By using this hybrid intelligence model, we can deliver <span className="text-white font-bold">verified, deep-dive analysis</span> on complex topics like ocean acidification or carbon policy instantly.
            </p>
            <p className="text-news-accent font-serif italic text-xl">
                "We don't ask you to trust a black box. We ask you to trust the data."
            </p>
        </div>

      </div>
    </div>
  );
};

export default MethodologyView;