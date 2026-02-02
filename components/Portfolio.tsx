import React from 'react';
import { Section, Article } from '../types';

import { ChevronRight, Filter, Sparkles, Headphones } from 'lucide-react';
import AdUnit from './AdUnit';
import { ADS_CONFIG } from '../data/adsConfig';
import { useAudio } from '../contexts/AudioContext';

interface PortfolioProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    searchQuery?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({
    articles,
    onArticleClick,
    searchQuery = '',
}) => {
    const { playArticle, isLoading, currentArticle } = useAudio();

    // Discover Mode: Show mixed content, prioritized by date/relevance (simulated by array order)
    // Filter only by search query
    // Discover Mode: Show mixed content
    // Sort logic: We want recently UPLOADED items (createdAt) to appear first in the feed,
    // so users see new content immediately, even if it is backdated (editorial date).
    const displayedArticles = (articles || [])
        .slice() // Create a shallow copy to avoid mutating props
        .sort((a, b) => {
            // Sort by CreatedAt (Newest Upload First)
            const createdA = new Date(a.createdAt || a.date).getTime();
            const createdB = new Date(b.createdAt || b.date).getTime();
            return createdB - createdA;
        })
        .filter(article => {
            // Exclude 'Act' category from Discover feed unless specifically searching
            return !searchQuery ||
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        }).slice(0, 100); // Increased limit to show more articles

    return (
        <section id={Section.NEWS} className="pt-0 pb-12 md:pt-4 md:pb-20 bg-black">
            <div className="container mx-auto px-4 md:px-8">

                {searchQuery ? (
                    <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-white/10 pb-6">
                        <span className="text-xs text-gray-400">Results for "{searchQuery}"</span>
                    </div>
                ) : (
                    <div className="mb-8 border-b border-white/10"></div>
                )}

                {displayedArticles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {(() => {
                            // Inject Ad at Index 2 (Top Right)
                            // We create a mixed array of content to render
                            const gridItems = [...displayedArticles];

                            // Insert ad placeholder at index 2
                            if (gridItems.length >= 2) {
                                gridItems.splice(2, 0, { id: 'ad-top-right', type: 'ad_placeholder' } as any);
                            }

                            // Insert second ad placeholder at index 7 (adjusted for previous shift)
                            if (gridItems.length >= 8) {
                                gridItems.splice(8, 0, { id: 'ad-mid-feed', type: 'ad_placeholder' } as any);
                            }

                            // Limit total items to maintain grid symmetry (optional, but good for layout)
                            // 12 items (0..11) usually fills rows nicely with the 2x2 featured item
                            const finalItems = gridItems.slice(0, 13); // Increased to accommodate ads

                            return finalItems.map((item, index) => {
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

                                // Render Ad Placeholder
                                if (item.type === 'ad_placeholder') {
                                    return (
                                        <div key={item.id} className={`${gridClass} ${imageHeight} bg-zinc-900/50 border border-white/5 overflow-hidden flex flex-col relative group`}>
                                            <div className="absolute top-2 right-2 z-10 text-[9px] text-gray-600 border border-gray-800 px-1 rounded">SPONSORED</div>
                                            <AdUnit format="auto" className="w-full h-full" slotId={item.id === 'ad-top-right' ? ADS_CONFIG.SLOTS.HOME_TOP_RIGHT : ADS_CONFIG.SLOTS.HOME_MID_FEED} />
                                        </div>
                                    );
                                }

                                // Render Article Card
                                const article = item as Article;
                                return (
                                    <React.Fragment key={article.id}>
                                        <div
                                            className={`group relative bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${gridClass}`}
                                            onClick={() => onArticleClick(article)}
                                        >
                                            <div className={`w-full overflow-hidden bg-zinc-900 ${imageHeight} ${index === 0 ? 'md:h-full' : ''} relative`}>
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                />
                                                {index === 0 && (
                                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                                                )}

                                                {/* Listen Button - Top Right */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playArticle(article);
                                                    }}
                                                    disabled={isLoading && currentArticle?.id === article.id}
                                                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-20 ${index === 0 ? 'top-4 right-4 w-10 h-10' : ''}`}
                                                    title="Listen to article"
                                                >
                                                    {isLoading && currentArticle?.id === article.id ? (
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Headphones size={index === 0 ? 16 : 14} />
                                                    )}
                                                </button>
                                            </div>

                                            <div className={`p-4 flex flex-col flex-grow ${index === 0 ? 'absolute bottom-0 left-0 w-full z-10' : ''}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`font-bold uppercase tracking-widest text-news-accent ${index === 0 ? 'text-xs' : 'text-[9px]'}`}>
                                                        {(() => {
                                                            const displayCategory = (cat: string) => cat === 'Action' || cat === 'Act' ? 'Guides' : cat;
                                                            const categories = Array.isArray(article.category) ? article.category : [article.category];
                                                            return categories.map(displayCategory).join(', ');
                                                        })()}
                                                    </span>
                                                </div>

                                                <h3 className={`${titleSize} font-serif font-bold text-white leading-tight mb-2 group-hover:text-gray-200 transition-colors`}>
                                                    {article.title}
                                                </h3>

                                                <p className={`text-sm text-gray-300 font-light mb-3 ${excerptClass}`}>
                                                    {article.excerpt || (Array.isArray(article.content) ? article.content[0] : '') || ''}
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
                            });
                        })()}
                    </div>
                ) : (
                    <div className="py-24 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                        <Filter size={32} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-serif font-bold text-white mb-2">No stories found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your search.</p>
                    </div>
                )}

                {/* Ad Placement 2: Divider between Grid and Upcoming Events */}
                {!searchQuery && (
                    <div className="w-full my-12 border-y border-white/5 bg-zinc-900/30 py-8">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-[9px] text-center text-gray-600 mb-4 uppercase tracking-widest">Sponsored</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                                <div className="flex flex-col items-center">
                                    <AdUnit format="rectangle" className="w-full h-64 md:h-72" slotId={ADS_CONFIG.SLOTS.HOME_DIVIDER_LEFT} />
                                </div>
                                <div className="flex flex-col items-center">
                                    <AdUnit format="rectangle" className="w-full h-64 md:h-72" slotId={ADS_CONFIG.SLOTS.HOME_DIVIDER_RIGHT} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Latest Guides Section */}
                {!searchQuery && (() => {
                    const guideArticles = (articles || []).filter(a => {
                        const categories = Array.isArray(a.category) ? a.category : [a.category];
                        return categories.includes('Guides') || categories.includes('Action') || categories.includes('Act');
                    }).slice(0, 4);

                    if (guideArticles.length === 0) return null;

                    return (
                        <div className="mt-8">
                            <div className="mb-8">
                                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Latest Guides</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {guideArticles.map((article, index) => (
                                    <div
                                        key={article.id}
                                        onClick={() => onArticleClick(article)}
                                        className="group cursor-pointer bg-zinc-900/30 border border-white/5 hover:bg-zinc-900 hover:border-news-accent/30 transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full"
                                    >
                                        <div className="aspect-[3/2] overflow-hidden relative">
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
                                                <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-white border border-white/10">
                                                    Guides
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playArticle(article);
                                                    }}
                                                    disabled={isLoading && currentArticle?.id === article.id}
                                                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                                    title="Listen to guide"
                                                >
                                                    {isLoading && currentArticle?.id === article.id ? (
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Headphones size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-sm md:text-base font-serif font-bold text-white leading-tight mb-2 group-hover:text-gray-200 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-grow">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-2 border-t border-white/5">
                                                <span>{article.date}</span>
                                                <span>•</span>
                                                <span>{article.originalReadTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Featured Articles Section - Only show if not searching */}
                {!searchQuery && (
                    <div className="mt-8">
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Featured Stories</h2>
                        </div>

                        {/* Featured Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {articles.filter(a => a.isFeaturedDiscover).slice(0, 4).map((article) => (
                                <div
                                    key={`feat-${article.id}`}
                                    onClick={() => onArticleClick(article)}
                                    className="group cursor-pointer bg-zinc-900/30 border border-white/5 hover:bg-zinc-900 hover:border-news-accent/30 transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full"
                                >
                                    <div className="aspect-[3/2] overflow-hidden relative">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
                                            <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-white border border-white/10">
                                                {(() => {
                                                    const cat = Array.isArray(article.category) ? article.category[0] : article.category;
                                                    return cat === 'Action' || cat === 'Act' ? 'Guides' : cat;
                                                })()}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playArticle(article);
                                                }}
                                                disabled={isLoading && currentArticle?.id === article.id}
                                                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                                title="Listen to story"
                                            >
                                                {isLoading && currentArticle?.id === article.id ? (
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Headphones size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-news-accent mb-2 truncate">{article.topic}</div>
                                        <h3 className="text-base font-serif font-bold text-white leading-tight mb-2 group-hover:text-news-accent transition-colors line-clamp-3">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 uppercase font-bold">
                                            <span className="truncate mr-1">{article.source}</span>
                                            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-white">
                                                Read <ChevronRight size={10} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Fallback if no featured articles */}
                            {articles.filter(a => a.isFeaturedDiscover).length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 text-sm border border-dashed border-white/5 rounded-lg">
                                    No featured stories selected yet. Use the CMS to feature articles.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Portfolio;