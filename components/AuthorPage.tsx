import React, { useEffect } from 'react';
import { ArrowLeft, Globe, Mail, Twitter, Linkedin, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface AuthorPageProps {
  onBack: () => void;
  onArticleClick: (article: any) => void;
  articles: any[];
}

const AuthorPage: React.FC<AuthorPageProps> = ({ onBack, onArticleClick, articles }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Alexander Westergårdh | Planetary Brief";
  }, []);

  const authorArticles = articles.slice(0, 6); // Showing some articles as "Latest"

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white pt-24 md:pt-36 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-12 text-center md:text-left">
          {/* Avatar Section */}
          <div className="w-full max-w-[180px] md:max-w-none md:w-1/3 flex-shrink-0">
            <div className="relative aspect-square md:aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group">
              <img 
                src="https://res.cloudinary.com/drwpqcvea/image/upload/v1773737828/alexander3_tdbi3o.jpg" 
                alt="Alexander Westergårdh" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            <div className="mt-6 md:mt-8">
              <a 
                href="mailto:alexander@planetarybrief.com" 
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-news-accent transition-colors flex items-center justify-center md:justify-start gap-2 group"
              >
                <Mail size={14} className="group-hover:scale-110 transition-transform" />
                alexander@planetarybrief.com
              </a>
            </div>
          </div>

          {/* Bio Section */}
          <div className="flex-grow">
            <span className="text-news-accent font-bold uppercase tracking-widest text-xs mb-8 block">Founder & Editor</span>
            
            <div className="prose prose-invert max-w-none text-gray-300 font-sans leading-relaxed space-y-6">
              <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                Alexander Westergårdh is the founder and editor of Planetary Brief, a data-driven environmental intelligence publication.
              </p>
              
              <p>
                His work focuses on translating scientific datasets, institutional reports, and monitoring systems into structured analysis of climate, energy, and planetary systems.
              </p>
              
              <p>
                Planetary Brief synthesizes information from international organizations, research institutions, and policy frameworks to provide clear, evidence-based insight into environmental change.
              </p>
              
              <p>
                He developed Planetary Brief to create a structured, accessible view of environmental systems beyond fragmented news coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Latest Work Section */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-serif font-bold">Latest Intelligence</h2>
            <div className="h-px flex-grow bg-white/10 ml-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {authorArticles.map((article) => (
              <a 
                key={article.id}
                href={`/article/${article.slug || article.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onArticleClick(article);
                }}
                className="group flex flex-col gap-4 p-6 bg-white/5 border border-white/5 rounded-xl hover:border-news-accent/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-news-accent">
                  <span>{article.articleType}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="text-gray-500">{article.date}</span>
                </div>
                <h3 className="text-xl font-serif font-bold group-hover:text-news-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                  Read Analysis <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
