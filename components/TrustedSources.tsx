import React, { useEffect } from 'react';
import { CheckCircle2, Globe, BookOpen, Microscope, Newspaper, Radio } from 'lucide-react';

interface TrustedSourcesProps {
  onBack: () => void;
}

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

const TrustedSources: React.FC<TrustedSourcesProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen animate-fade-in text-white pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Trusted Sources</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            GreenShift prioritizes accuracy above all else. Our algorithm and editorial team exclusively aggregate data from these verified, high-integrity institutions and publications.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sourceCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 hover:bg-zinc-900 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-news-accent/10 rounded-full text-news-accent">
                  <category.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-news-accent transition-colors">
                    {category.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">
                    {category.description}
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300 group-hover:text-white transition-colors">
                    <CheckCircle2 size={14} className="mt-1 text-news-accent/50 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <div className="max-w-2xl mx-auto text-center mt-20 pt-10 border-t border-white/10">
          <p className="text-gray-500 text-sm italic">
            "We are not entitled to our own facts." — This index is updated quarterly to ensure the highest standards of scientific integrity.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TrustedSources;