import React from 'react';
import { Section } from '../types';
import { Globe2, ShieldCheck, Zap, ArrowRight, BrainCircuit, Database, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onShowMethodology: () => void;
  onShowSources: () => void;
}

const sources = [
    "NASA Climate", 
    "IPCC Reports", 
    "NOAA Data", 
    "Nature Journal", 
    "Science", 
    "UN Environment", 
    "Carbon Brief", 
    "Bloomberg Green"
];

const About: React.FC<AboutProps> = ({ onShowMethodology, onShowSources }) => {
  return (
    <section id={Section.ABOUT} className="py-20 md:py-32 bg-zinc-900 border-y border-white/5 relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-news-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-5 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: The Pitch */}
          <div className="lg:col-span-7 flex flex-col">
             <div className="inline-flex items-center gap-2 text-news-accent font-bold uppercase tracking-widest text-xs mb-6 border border-news-accent/20 px-4 py-1.5 rounded-full bg-news-accent/5 w-fit">
                <BrainCircuit size={14} />
                <span>Augmented Reporting</span>
             </div>
             
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight text-white">
               Powered by AI. <br/>
               <span className="text-gray-500">Grounded in Science.</span>
             </h2>
             
             <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-10 max-w-2xl">
               Navigating the complexity of the climate crisis requires both speed and accuracy. GreenShift uses <strong>assisted intelligence</strong> to monitor and synthesize planetary data, ensuring every insight is cross-referenced with verified scientific sources.
             </p>

             {/* Benefit Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex gap-4">
                    <div className="mt-1">
                        <Globe2 className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2">Global Monitoring</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            We scan scientific journals and legislative updates to catch critical developments often missed by the mainstream cycle.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="mt-1">
                        <ShieldCheck className="text-emerald-400" size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2">Verification First</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Our AI is strictly constrained to verified datasets. We prioritize accuracy and provenance over speed or sensationalism.
                        </p>
                    </div>
                </div>
             </div>

             <div className="flex flex-wrap gap-4">
                 <button 
                    onClick={onShowMethodology}
                    className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors flex items-center gap-2"
                 >
                    Our Methodology <ArrowRight size={14} />
                 </button>
                 <button 
                    onClick={onShowSources}
                    className="border border-white/20 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center gap-2"
                 >
                    View Source List
                 </button>
             </div>
          </div>

          {/* Right Column: The "Trust Battery" Visual */}
          <div className="lg:col-span-5 relative">
             <div className="relative rounded-2xl bg-black border border-white/10 p-8 shadow-2xl overflow-hidden group hover:border-news-accent/30 transition-colors duration-500">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Data Stream</div>
                        <div className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Ingestion Active
                        </div>
                    </div>
                    <Database className="text-gray-600" size={20} />
                </div>

                {/* Source List Simulation */}
                <div className="space-y-4 mb-8">
                    {sources.map((source, i) => (
                        <div key={i} className="flex items-center justify-between text-sm group/item">
                            <div className="flex items-center gap-3 text-gray-400 group-hover/item:text-white transition-colors">
                                <CheckCircle2 size={14} className="text-emerald-500/50 group-hover/item:text-emerald-500 transition-colors" />
                                <span>{source}</span>
                            </div>
                            <div className="text-[10px] font-mono text-gray-600 group-hover/item:text-emerald-500 transition-colors">
                                VERIFIED
                            </div>
                        </div>
                    ))}
                    <div className="text-center pt-4 text-xs text-gray-500 italic">
                        + 42 other monitoring nodes
                    </div>
                </div>

                {/* "AI Processing" Badge */}
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
                        <Zap size={20} className="fill-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">Synthesized by GreenShift AI</div>
                        <div className="text-[10px] text-gray-400">Processing verified scientific data</div>
                    </div>
                </div>

             </div>
             
             {/* Decorative Elements behind card */}
             <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-white/5 rounded-2xl"></div>
             <div className="absolute -z-20 top-20 -right-20 w-full h-full border border-white/5 rounded-2xl opacity-50"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;