import React from 'react';
import { Article } from '../types';
import { newsArticles } from '../data/content';
import { Filter, ArrowRight } from 'lucide-react';
import AdUnit from './AdUnit';

interface CategoryFeedProps {
  category: string;
  onArticleClick: (article: Article) => void;
  onBack: () => void;
}

const categoryDescriptions: Record<string, string> = {
  "Climate Change": "Beyond just temperature rise, we track the systemic destabilization of planetary boundaries. From the collapsing cryosphere to shifting monsoon patterns, this feed aggregates verified data on how the Earth's fundamental systems are responding to anthropogenic forcing.",
  "Energy": "The largest industrial transition in human history is underway. We analyze the shift from combustion to electrons, tracking efficiency breakthroughs in photovoltaics, the resurgence of nuclear baseload, and the critical mineral supply chains defining the new energy geopolitics.",
  "Pollution": "Monitoring the chemical footprint of civilization. We track the lifecycle of novel entities—from microplastics crossing the blood-brain barrier to forever chemicals (PFAS) in our water systems—and the regulatory frameworks emerging to contain them.",
  "Policy & Economics": "The intersection of climate physics and market forces. We cover the carbon border adjustments, green taxonomy regulations, and capital flows that are rewriting the rules of the global economy and forcing a valuation of natural capital.",
  "Oceans": "Covering the 71% of our planet that acts as its heat shield. From the slowing AMOC circulation to the acidification threatening marine food webs, we report on the blue economy and the health of the hydrosphere.",
  "Biodiversity": "We are witnessing the sixth mass extinction. This feed monitors the Living Planet Index, tracking the rapid decline of vertebrate populations and the collapse of insect biomass, alongside the rewilding efforts attempting to reverse the tide.",
  "Conservation": "Stories of ecological restoration and resilience. We highlight the indigenous guardianship, protected area expansions, and species recovery programs that prove nature can bounce back when given space and legal protection.",
  "Solutions": "Moving beyond hope to tangible action. We profile the scalable technologies and social innovations—from direct air capture to regenerative agriculture—that provide a roadmap for staying within planetary boundaries."
};

const categoryImages: Record<string, string> = {
  "Climate Change": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070", // Stormy coast / abstract climate
  "Energy": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2070", // Solar farm
  "Pollution": "https://images.unsplash.com/photo-1621451537029-4c2f2c7a6e14?q=80&w=2070", // Ocean plastic cleanup
  "Policy & Economics": "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2070", // Abstract finance/nature
  "Oceans": "https://images.unsplash.com/photo-1583212235753-325f32726478?q=80&w=2070", // Underwater reef
  "Biodiversity": "https://images.unsplash.com/photo-1550147760-44c9960d6fbc?q=80&w=2070", // Lush jungle
  "Conservation": "https://images.unsplash.com/photo-1533241242330-d309bc087f98?q=80&w=2070", // Indigenous / Forest
  "Solutions": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" // Green city office
};

const mapTopicToCategory = (topic: string): string => {
    // Direct match for main categories
    const mainCategories = [
        "Climate Change", "Energy", "Pollution", "Policy & Economics", 
        "Oceans", "Biodiversity", "Conservation", "Solutions"
    ];
    
    if (mainCategories.includes(topic)) return topic;

    // Fallbacks for legacy/other topics
    if (topic === 'Forests') return 'Conservation';
    if (topic === 'Food') return 'Solutions';
    if (topic === 'Cities') return 'Solutions'; 
    if (topic === 'Justice') return 'Policy & Economics';
    if (topic === 'Economy') return 'Policy & Economics';
    if (topic === 'Technology') return 'Solutions';
    
    return 'Climate Change'; 
};

const CategoryFeed: React.FC<CategoryFeedProps> = ({ category, onArticleClick }) => {
  
  const filteredArticles = newsArticles.filter(article => {
      const mapped = mapTopicToCategory(article.topic);
      return mapped === category;
  });

  const description = categoryDescriptions[category] || "Latest intelligence, verified data, and policy updates.";
  const headerImage = categoryImages[category] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  // Split content: First article goes to Hero section, rest go to Grid
  const heroArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Unified Hero Section: Shared Background for Explainer and Hero Article */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-12 min-h-[550px] flex items-center group/hero">
            
            {/* Shared Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={headerImage} 
                    alt={category} 
                    className="w-full h-full object-cover opacity-50 blur-[2px] scale-105 transition-transform duration-[20s] ease-in-out group-hover/hero:scale-110"
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/70 to-black/40"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content Container (Grid) */}
            <div className="relative z-10 w-full p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* Left: Explainer Text */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-[0.9] tracking-tight drop-shadow-2xl">
                        {category}
                    </h1>
                    <div className="h-1 w-24 bg-news-accent mb-8 shadow-[0_0_15px_#10b981]"></div>
                    <p className="text-gray-200 text-lg md:text-2xl font-light leading-relaxed max-w-xl drop-shadow-lg">
                        {description}
                    </p>
                </div>

                {/* Right: Hero Article Card */}
                {heroArticle ? (
                    <div 
                        onClick={() => onArticleClick(heroArticle)}
                        className="group relative aspect-[4/3] md:aspect-video lg:aspect-[4/3] w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                    >
                         <img 
                            src={heroArticle.imageUrl} 
                            alt={heroArticle.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                         
                         <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
                            <span className="text-news-accent text-[10px] font-bold uppercase tracking-widest mb-3 block bg-black/50 backdrop-blur w-fit px-2 py-1 rounded">
                                Featured Report
                            </span>
                            <h2 className="text-xl md:text-3xl font-serif font-bold text-white leading-tight mb-4 group-hover:underline decoration-2 decoration-news-accent underline-offset-4 shadow-black drop-shadow-lg">
                                {heroArticle.title}
                            </h2>
                            <p className="text-gray-300 line-clamp-2 text-xs md:text-sm mb-4 drop-shadow-md font-medium">
                                {heroArticle.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                                <span>Read Full Story</span> <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                         </div>
                    </div>
                ) : (
                    // Fallback placeholder
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 p-8 text-center aspect-[4/3] backdrop-blur-sm">
                         <Filter size={32} className="text-gray-400 mb-4" />
                         <p className="text-gray-300 font-serif text-lg">Curating Intelligence...</p>
                    </div>
                )}
            </div>
        </div>

        {/* Remaining Articles Grid */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {gridArticles.map((article, index) => {
                 // Index 0 in this list is the 2nd article overall. 
                 
                 let gridClass = "col-span-1";
                 let titleSize = "text-sm md:text-base";
                 let imageHeight = "aspect-[3/2]";
                 let excerptClass = "line-clamp-2";

                 if (index === 0) {
                     // The first article of the remaining grid gets the "Featured" Bento treatment
                     gridClass = "col-span-2 md:col-span-2 row-span-2";
                     titleSize = "text-xl md:text-3xl";
                     imageHeight = "aspect-video md:aspect-[16/9]";
                     excerptClass = "line-clamp-3 md:line-clamp-4";
                 } else if (index === 1 || index === 2) {
                     // Medium cards
                     gridClass = "col-span-2 md:col-span-1";
                     titleSize = "text-lg md:text-xl";
                     imageHeight = "aspect-video md:aspect-[3/2]";
                     excerptClass = "line-clamp-3";
                 } else {
                     // Standard compact cards
                     gridClass = "col-span-1";
                     titleSize = "text-sm md:text-base";
                     imageHeight = "aspect-[3/2]";
                     excerptClass = "line-clamp-3";
                 }

                 return (
                    <React.Fragment key={article.id}>
                        {/* Insert Ad after the 4th item (index 4) as a Grid Card */}
                        {index === 4 && (
                            <div className="col-span-1 bg-zinc-900/50 border border-white/5 rounded-sm overflow-hidden flex flex-col h-full min-h-[250px]">
                                <div className="flex-grow">
                                     <AdUnit format="rectangle" className="w-full h-full" slotId="category-feed-1" />
                                </div>
                            </div>
                        )}
                        
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
                    </React.Fragment>
                 );
             })}
          </div>
        )}

        {/* Ad Unit at bottom */}
        <div className="mt-16">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <span>Sponsored</span>
                <div className="h-px bg-gray-800 flex-grow"></div>
            </div>
            <AdUnit format="horizontal" className="h-32" slotId="category-feed-footer" />
        </div>

      </div>
    </div>
  );
};

export default CategoryFeed;