import React from 'react';
import { Section, Article } from '../types';
import { newsArticles, upcomingEvents } from '../data/content';
import { ChevronRight, Filter, Calendar } from 'lucide-react';
import AdUnit from './AdUnit';

interface PortfolioProps {
  onArticleClick: (article: Article) => void;
  searchQuery?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ 
    onArticleClick, 
    searchQuery = '', 
}) => {
  
  // Discover Mode: Show mixed content, prioritized by date/relevance (simulated by array order)
  // Filter only by search query
  const displayedArticles = newsArticles.filter(article => 
    !searchQuery || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 11); // Show top 11 items for the grid to fill rows nicely

  return (
    <section id={Section.NEWS} className="pt-0 pb-12 md:pt-4 md:pb-20 bg-black">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-white/10 pb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Discover
            </h2>
            {searchQuery && (
                 <span className="text-xs text-gray-400">Results for "{searchQuery}"</span>
            )}
        </div>

        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {displayedArticles.map((article, index) => {
                 // Dynamic Grid Layout Logic
                 // Index 0: Large (Full width mobile, 2x2 desktop)
                 // Index 1, 2: Medium (1 col mobile, 1 col desktop)
                 // Rest: Standard 
                 
                 let gridClass = "col-span-1";
                 let titleSize = "text-sm md:text-base";
                 let imageHeight = "aspect-[3/2]";
                 let excerptClass = "line-clamp-2";

                 if (index === 0) {
                     gridClass = "col-span-2 md:col-span-2 row-span-2";
                     titleSize = "text-xl md:text-3xl";
                     imageHeight = "aspect-video md:aspect-[16/9]";
                     excerptClass = "line-clamp-3 md:line-clamp-4";
                 } else if (index === 1 || index === 2) {
                     gridClass = "col-span-2 md:col-span-1"; // Full width mobile, 1 col desktop
                     titleSize = "text-lg md:text-xl";
                     imageHeight = "aspect-video md:aspect-[3/2]";
                     excerptClass = "line-clamp-3";
                 } else {
                     // Standard compact card
                     gridClass = "col-span-1";
                     titleSize = "text-sm md:text-base";
                     imageHeight = "aspect-[3/2]";
                     excerptClass = "line-clamp-3";
                 }

                 return (
                    <React.Fragment key={article.id}>
                        <div 
                            className={`group relative bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${gridClass}`}
                            onClick={() => onArticleClick(article)}
                        >
                            <div className={`w-full overflow-hidden bg-zinc-900 ${imageHeight} ${index === 0 ? 'md:h-full' : ''}`}>
                                <img 
                                    src={article.imageUrl} 
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                />
                                {index === 0 && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                                )}
                            </div>

                            <div className={`p-4 flex flex-col flex-grow ${index === 0 ? 'absolute bottom-0 left-0 w-full z-10' : ''}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-bold uppercase tracking-widest text-news-accent ${index === 0 ? 'text-xs' : 'text-[9px]'}`}>
                                        {article.category}
                                    </span>
                                </div>
                                
                                <h3 className={`${titleSize} font-serif font-bold text-white leading-tight mb-2 group-hover:text-gray-200 transition-colors`}>
                                    {article.title}
                                </h3>

                                <p className={`text-sm text-gray-300 font-light mb-3 ${excerptClass}`}>
                                    {article.excerpt}
                                </p>
                                
                                {index !== 0 && (
                                    <div className="mt-auto pt-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                        <span>{article.date.split(',')[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ad Placement 1: After 6th item (index 5) - Row 3 Slot 2 on Desktop */}
                        {index === 5 && (
                            <div className="col-span-1 bg-zinc-900/50 border border-white/5 rounded-sm overflow-hidden flex flex-col">
                                <div className="flex-grow">
                                     <AdUnit format="rectangle" className="w-full h-full" slotId="home-grid-1" />
                                </div>
                            </div>
                        )}

                        {/* Ad Placement 2: After 11th item (index 10) - Row 4 Slot 4 on Desktop */}
                        {index === 10 && (
                            <div className="col-span-1 bg-zinc-900/50 border border-white/5 rounded-sm overflow-hidden flex flex-col">
                                <div className="flex-grow">
                                     <AdUnit format="rectangle" className="w-full h-full" slotId="home-grid-2" />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                 );
             })}
          </div>
        ) : (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <Filter size={32} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-serif font-bold text-white mb-2">No stories found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your search.</p>
            </div>
        )}

        {/* Upcoming Political Events Section - Only show if not searching */}
        {!searchQuery && (
            <div className="mt-20 pt-10 border-t border-white/10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-news-accent/10 rounded-full text-news-accent">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Upcoming Global Decisions</h2>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">Critical political events shaping the environmental agenda.</p>
                    </div>
                </div>

                {/* Updated Grid: grid-cols-2 on mobile (default) to fit 2 in a row */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {upcomingEvents.map((event) => (
                        <div 
                            key={event.id}
                            onClick={() => onArticleClick(event)}
                            className="group cursor-pointer bg-zinc-900/30 border border-white/5 hover:bg-zinc-900 hover:border-news-accent/30 transition-all duration-300 rounded-lg overflow-hidden flex flex-col"
                        >
                            <div className="aspect-[3/2] overflow-hidden relative">
                                <img 
                                    src={event.imageUrl} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                                />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-white border border-white/10">
                                    {event.date}
                                </div>
                            </div>
                            <div className="p-3 md:p-5 flex flex-col flex-grow">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-news-accent mb-2 truncate">{event.topic}</div>
                                <h3 className="text-xs md:text-base font-serif font-bold text-white leading-tight mb-2 md:mb-3 group-hover:text-news-accent transition-colors line-clamp-3 md:line-clamp-none">
                                    {event.title}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-400 line-clamp-2 md:line-clamp-3 mb-3 md:mb-4 leading-relaxed">
                                    {event.excerpt}
                                </p>
                                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 uppercase font-bold">
                                    <span className="truncate mr-1">{event.source}</span>
                                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-white flex-shrink-0">
                                        <span className="hidden md:inline">Briefing</span> <ChevronRight size={10} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default Portfolio;