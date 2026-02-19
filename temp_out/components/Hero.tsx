import React from 'react';
import { Section, Article } from '../types';
import { heroContent, newsArticles } from '../data/content';
import { FileText, ArrowRight, Clock } from 'lucide-react';

interface HeroProps {
  onReadFeatured: () => void;
  onArticleClick: (article: Article) => void;
}

const Hero: React.FC<HeroProps> = ({ onReadFeatured, onArticleClick }) => {
  // Get 3 recent stories for the sidebar (skipping the featured one)
  const breakingNews = newsArticles.slice(1, 4);

  return (
    <section id={Section.HERO} className="relative w-full bg-black text-white pt-32 md:pt-40 pb-2">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            
            {/* Column 1: Main Story Text (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-news-live animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-news-accent">Featured Report</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-serif font-bold leading-tight mb-6 text-white hover:text-gray-200 cursor-pointer transition-colors" onClick={onReadFeatured}>
                    {heroContent.headline}
                </h1>
                
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-light line-clamp-4">
                    {heroContent.subheadline}
                </p>
                
                <div className="mt-auto flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>{heroContent.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span>GreenShift Original</span>
                </div>
            </div>

            {/* Column 2: Main Story Image (5 cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
                <div 
                    className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer group"
                    onClick={onReadFeatured}
                >
                    <img 
                        src={heroContent.imageUrl} 
                        alt={heroContent.headline}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="mt-2 text-[10px] text-gray-600 uppercase tracking-widest text-right">
                    Photo: Unsplash / Editorial
                </p>
            </div>

            {/* Column 3: Selected Articles Sidebar (3 cols) */}
            <div className="lg:col-span-3 flex flex-col order-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-news-accent text-xs font-bold uppercase tracking-widest">Selected Articles</span>
                    <ArrowRight size={12} className="text-news-accent -rotate-45" />
                </div>

                <div className="flex flex-col gap-6 divide-y divide-white/10">
                    {breakingNews.map((news) => (
                        <div key={news.id} className="pt-6 first:pt-0 group cursor-pointer" onClick={() => onArticleClick(news)}>
                            <h3 className="text-base font-serif font-bold text-white leading-tight mb-2 group-hover:text-news-accent transition-colors">
                                {news.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <span className="text-news-accent/80">{news.topic}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {news.date.split(' ')[0]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;