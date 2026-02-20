import React from 'react';
import { Section, Article } from '../types';
import { heroContent } from '../data/content'; // Default content
import { Headphones, ArrowUpRight } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface HeroProps {
    onReadFeatured: () => void;
    onArticleClick: (article: Article) => void;
    featuredArticleOverride?: Article;
    articles?: Article[]; // Kept for interface compatibility but unused for now
}

const Hero: React.FC<HeroProps> = ({ onReadFeatured, onArticleClick, featuredArticleOverride }) => {
    const { playArticle, isLoading, currentArticle } = useAudio();

    // Priority: Override (from Config) > Static heroContent
    const displayHeadline = featuredArticleOverride?.title || heroContent.headline;
    const displaySubheadline = featuredArticleOverride?.excerpt || heroContent.subheadline;
    const displayDate = featuredArticleOverride?.date || heroContent.date;
    const displayImageUrl = featuredArticleOverride?.imageUrl || heroContent.imageUrl;
    const displaySource = featuredArticleOverride?.source || heroContent.source;

    // Category display logic
    const categoryLabel = featuredArticleOverride
        ? (Array.isArray(featuredArticleOverride.category) ? featuredArticleOverride.category[0] : featuredArticleOverride.category)
        : "Planetary Intelligence";

    return (
        <section id={Section.HERO} className="relative w-full bg-black text-white pt-6 md:pt-12 pb-6 md:pb-12 overflow-hidden border-b border-white/5">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-zinc-900/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 items-stretch">

                    {/* Left Column: Strategic Context (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col order-2 lg:order-1 pt-6 pb-2 md:py-4">

                        {/* Signal / Category */}
                        <div className="flex items-center gap-1.5 md:gap-3 mb-4 md:mb-6 w-full flex-nowrap overflow-hidden">
                            <span className="shrink-0 bg-news-accent/10 border border-news-accent/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest text-news-accent flex items-center gap-1 md:gap-2">
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-news-accent shadow-[0_0_5px_#10b981]"></span>
                                {featuredArticleOverride?.articleType || "Deep Dive Analysis"}
                            </span>
                            <span className="shrink min-w-0 flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest text-gray-500">
                                <span className="truncate">{categoryLabel}</span>
                                <span className="shrink-0 w-px h-2.5 md:h-3 bg-gray-800"></span>
                                <span className="shrink-0 whitespace-nowrap">{displayDate}</span>
                            </span>
                        </div>

                        {/* Headline */}
                        <h1
                            className="text-[28px] sm:text-4xl md:text-5xl xl:text-6xl font-serif font-bold leading-[1.1] mb-4 md:mb-6 text-white hover:text-gray-200 cursor-pointer transition-colors tracking-tight"
                            onClick={onReadFeatured}
                        >
                            {displayHeadline}
                        </h1>

                        {/* Analytical Subheading */}
                        <p className="text-[15px] sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-6 md:mb-8 border-l-2 border-news-accent/30 pl-4 md:pl-6">
                            {displaySubheadline}
                        </p>

                        {/* Metadata & Actions */}
                        <div className="flex items-center gap-4 md:gap-6 mt-auto">
                            <button
                                onClick={onReadFeatured}
                                className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2.5 md:px-6 md:py-3 rounded-sm hover:bg-gray-200 transition-colors"
                            >
                                Read Briefing <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </button>

                            <div className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                                {featuredArticleOverride?.originalReadTime || "10 min read"}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Anchor (7 cols) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 h-full py-0 md:py-4">
                        <div
                            className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-auto lg:h-full bg-zinc-900 rounded-sm overflow-hidden cursor-pointer group shadow-2xl shadow-black/50"
                            onClick={onReadFeatured}
                        >
                            <img
                                src={displayImageUrl}
                                alt={displayHeadline}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />

                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent"></div>

                            {/* Audio Button */}
                            {featuredArticleOverride && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playArticle(featuredArticleOverride);
                                    }}
                                    disabled={isLoading && currentArticle?.id === featuredArticleOverride.id}
                                    className="absolute top-3 right-3 md:top-6 md:right-6 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-news-accent hover:text-black hover:border-news-accent transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xl z-20 group/audio"
                                    title="Listen to analysis"
                                >
                                    {isLoading && currentArticle?.id === featuredArticleOverride.id ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Headphones className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;