import React, { useEffect } from 'react';
import { ArrowLeft, Leaf, Droplets, Zap, Heart, Scale, Recycle, TreePine, Megaphone, Globe, Utensils, Home, Car, DollarSign, Vote, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

interface ActionDetailsViewProps {
  onBack: () => void;
  onSearch: (query: string) => void;
}

const lifestyleActions = [
  {
    category: "Finance",
    title: "Green Your Money",
    searchKey: "Banking",
    icon: DollarSign,
    impact: "High",
    effort: "Low",
    desc: "Your bank might be funding fossil fuels. Switching to a sustainable bank or ethical pension fund is one of the most powerful individual actions you can take.",
    steps: ["Audit your bank using Bank.Green", "Move savings to a credit union or ESG fund", "Divest your pension"]
  },
  {
    category: "Diet",
    title: "Plant-Rich Diet",
    searchKey: "Protein",
    icon: Utensils,
    impact: "High",
    effort: "Medium",
    desc: "Animal agriculture accounts for 14.5% of global emissions. Reducing meat and dairy consumption frees up land for rewilding and reduces methane.",
    steps: ["Try 'Meatless Mondays'", "Switch to oat or soy milk", "Buy local, seasonal produce to cut transport emissions"]
  },
  {
    category: "Energy",
    title: "Electrify Everything",
    searchKey: "Heat Pumps",
    icon: Home,
    impact: "High",
    effort: "High",
    desc: "Moving away from gas/oil heating and cooking to electric alternatives prepares your home for a renewable grid.",
    steps: ["Install a heat pump", "Switch to an induction cooktop", "Improve insulation to stop heat leak"]
  },
  {
    category: "Transport",
    title: "Low-Carbon Travel",
    searchKey: "Aviation",
    icon: Car,
    impact: "Medium",
    effort: "Medium",
    desc: "Transport is the fastest-growing source of emissions. Reducing reliance on private combustion cars is essential.",
    steps: ["Prioritize public transit or cycling", "If buying a car, go Electric (EV)", "Replace one long-haul flight with a train journey"]
  },
  {
    category: "Civic",
    title: "Political Action",
    searchKey: "Suing",
    icon: Vote,
    impact: "High",
    effort: "Medium",
    desc: "Systemic change requires policy. Politicians act when they feel pressure from constituents.",
    steps: ["Vote for climate-conscious candidates", "Join a local town hall meeting", "Contact your representative about specific bills"]
  },
  {
    category: "Waste",
    title: "Circular Living",
    searchKey: "Circular",
    icon: Recycle,
    impact: "Low",
    effort: "Medium",
    desc: "We cannot recycle our way out of the crisis, but we can reduce consumption and waste.",
    steps: ["Buy second-hand / vintage", "Repair clothes instead of discarding", "Compost food waste to reduce methane in landfills"]
  }
];

const organizationList = [
    {
      title: "Support Activism",
      searchKey: "Suing",
      org: "Greenpeace",
      desc: "Join global campaigns to hold polluters accountable and influence environmental policy.",
      link: "https://www.greenpeace.org/",
      icon: Megaphone,
      color: "text-green-500"
    },
    {
      title: "Protect Wildlife",
      searchKey: "Extinction",
      org: "World Wildlife Fund",
      desc: "Conserve nature and reduce the most pressing threats to the diversity of life on Earth.",
      link: "https://www.worldwildlife.org/",
      icon: Heart,
      color: "text-orange-500"
    },
    {
      title: "Clean The Oceans",
      searchKey: "Garbage Patch",
      org: "The Ocean Cleanup",
      desc: "Support advanced technologies to rid the world's oceans of plastic.",
      link: "https://theoceancleanup.com/",
      icon: Droplets,
      color: "text-blue-500"
    },
    {
      title: "Reforestation",
      searchKey: "Trees",
      org: "One Tree Planted",
      desc: "Restore forests, create habitat for biodiversity, and make a positive social impact.",
      link: "https://onetreeplanted.org/",
      icon: TreePine,
      color: "text-emerald-600"
    },
    {
      title: "Legal Defense",
      searchKey: "Lawyers",
      org: "Earthjustice",
      desc: "The premier nonprofit public interest environmental law organization.",
      link: "https://earthjustice.org/",
      icon: Scale,
      color: "text-yellow-500"
    },
    {
      title: "End Plastic Pollution",
      searchKey: "Plastic",
      org: "Plastic Pollution Coalition",
      desc: "A global alliance working toward a world free of plastic pollution.",
      link: "https://www.plasticpollutioncoalition.org/",
      icon: Recycle,
      color: "text-cyan-400"
    },
    {
      title: "Sustainable Energy",
      searchKey: "Heat Pumps",
      org: "Rewiring America",
      desc: "Electrify your home and community to save money and the climate.",
      link: "https://www.rewiringamerica.org/",
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      title: "Climate Education",
      searchKey: "Education",
      org: "Climate Reality Project",
      desc: "Catalyzing a global solution to the climate crisis by making urgent action a necessity.",
      link: "https://www.climaterealityproject.org/",
      icon: Globe,
      color: "text-blue-400"
    },
    {
      title: "Preserve Habitats",
      searchKey: "Biodiversity",
      org: "The Nature Conservancy",
      desc: "Conserving the lands and waters on which all life depends.",
      link: "https://www.nature.org/",
      icon: Leaf,
      color: "text-green-400"
    },
    {
      title: "Reduce Food Waste",
      searchKey: "Food Waste",
      org: "Too Good To Go",
      desc: "Rescue unsold food from shops and restaurants to save it from going to waste.",
      link: "https://toogoodtogo.com/",
      icon: Utensils,
      color: "text-pink-500"
    },
    {
      title: "Grassroots Movement",
      searchKey: "Activism",
      org: "Sunrise Movement",
      desc: "A youth movement to stop climate change and create millions of good jobs in the process.",
      link: "https://www.sunrisemovement.org/",
      icon: Megaphone,
      color: "text-yellow-600"
    },
    {
      title: "Indigenous Rights",
      searchKey: "Amazon",
      org: "Amazon Watch",
      desc: "Protecting the rainforest and advancing the rights of Indigenous peoples in the Amazon Basin.",
      link: "https://amazonwatch.org/",
      icon: TreePine,
      color: "text-green-600"
    }
];

const ActionDetailsView: React.FC<ActionDetailsViewProps> = ({ onBack, onSearch }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-32 pb-24">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 font-medium text-xs tracking-widest uppercase"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-news-accent transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-news-accent font-bold uppercase tracking-widest text-xs mb-4 block animate-pulse">Action Protocol</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">What Can I Do?</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
             Climate anxiety is fueled by inaction. The antidote is agency. 
             Below is a comprehensive guide to systemic influence and personal lifestyle changes that make a tangible difference.
          </p>
        </div>

        {/* SECTION 1: EVERYDAY LIFE */}
        <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                <div className="p-3 bg-white/5 rounded-lg">
                    <Home size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Everyday Impact</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Personal Lifestyle Changes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lifestyleActions.map((action, idx) => (
                    <div key={idx} className="bg-zinc-900/40 border border-white/10 rounded-xl p-8 hover:bg-zinc-900 hover:border-news-accent/30 transition-all duration-300 group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-news-accent/10 rounded-full text-news-accent group-hover:scale-110 transition-transform">
                                <action.icon size={24} />
                            </div>
                            <div className="flex gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-white/10 ${
                                    action.impact === 'High' ? 'bg-news-accent/20 text-news-accent' : 'bg-white/5 text-gray-400'
                                }`}>
                                    {action.impact} Impact
                                </span>
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold font-serif text-white mb-3">{action.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 h-16">{action.desc}</p>
                        
                        <div className="space-y-3 pt-6 border-t border-white/5 mb-6 flex-grow">
                            {action.steps.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-3">
                                    <CheckCircle2 size={14} className="text-news-accent mt-1 flex-shrink-0" />
                                    <span className="text-xs text-gray-300">{step}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => onSearch(action.searchKey || action.title)}
                            className="w-full mt-auto pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            <FileText size={14} />
                            Related Articles
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION 2: ORGANIZATIONS */}
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                <div className="p-3 bg-white/5 rounded-lg">
                    <Globe size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Collective Power</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Organizations & Initiatives</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {organizationList.map((item, idx) => (
                    <div 
                    key={idx} 
                    className="group bg-zinc-900/50 border border-white/10 hover:border-news-accent/50 p-6 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-900 flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-2 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                                <item.icon size={18} />
                            </div>
                            <h3 className="font-serif font-bold text-base text-white group-hover:text-news-accent transition-colors">{item.title}</h3>
                        </div>
                        
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pb-2 w-full border-b border-white/5">{item.org}</span>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-grow">{item.desc}</p>
                        
                        <div className="mt-auto flex gap-2">
                             <a 
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-[10px] font-bold uppercase tracking-widest text-white hover:text-news-accent transition-colors bg-white/5 hover:bg-white/10 py-2 rounded flex items-center justify-center gap-2"
                             >
                                Act Now <ExternalLink size={10} />
                             </a>
                             <button
                                onClick={() => onSearch(item.searchKey || item.title)}
                                className="flex-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors bg-transparent border border-white/10 hover:bg-white/5 py-2 rounded flex items-center justify-center gap-2"
                             >
                                <FileText size={10} /> Articles
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ActionDetailsView;