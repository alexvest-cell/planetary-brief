import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { newsArticles } from '../data/content';
import { CATEGORIES, mapTopicToCategory } from '../data/categories';
import { homepageConfig } from '../data/homepageConfig'; // Import config for signals
import { Filter, ArrowRight, Headphones, Activity } from 'lucide-react';
import AdUnit from './AdUnit';
import { ADS_CONFIG } from '../data/adsConfig';
import { useAudio } from '../contexts/AudioContext';
import { HUB_METRICS } from '../data/hubMetrics';
import { HUB_DEVELOPMENTS } from '../data/hubDevelopments';
import { HUB_RELATED } from '../data/hubRelated';

interface CategoryFeedProps {
    category: string;
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onBack: () => void;
    onViewDashboard?: () => void;
    onCategorySelect?: (category: string) => void;
}

const CategoryFeed: React.FC<CategoryFeedProps> = ({ category, articles, onArticleClick, onViewDashboard, onCategorySelect }) => {
    const { playArticle, isLoading, currentArticle } = useAudio();
    // sub-category state removed

    // Ensure we have articles, fallback to empty array if undefined
    const sourceArticles = articles || [];

    // SEO Optimization
    React.useEffect(() => {
        document.title = `${category} | Planetary Brief Intelligence`;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        const catData = CATEGORIES.find(c => c.id === category);
        metaDesc.setAttribute('content', catData?.description || `Latest environmental intelligence on ${category}.`);

    }, [category]);

    const filteredArticles = useMemo(() => {
        const baseFiltered = sourceArticles.filter(article => {
            // Normalize: remove special chars, lowercase
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

            // Handle "Climate & Energy Systems" vs "Climate and Energy Systems"
            const normalizeLoose = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

            const target = normalize(category);
            const targetLoose = normalizeLoose(category);

            const checkMatch = (cat: string) => {
                const n = normalize(cat);
                const nl = normalizeLoose(cat);
                return n === target || nl === targetLoose || n.includes(target) || target.includes(n);
            };

            if (Array.isArray(article.category)) {
                return article.category.some(cat => checkMatch(cat));
            } else if (typeof article.category === 'string') {
                return checkMatch(article.category);
            }

            // Legacy/Topic fallback
            if (article.topic === category) return true;
            return false;
        });

        return baseFiltered;
    }, [sourceArticles, category]);

    const catData = CATEGORIES.find(c => c.id === category);
    const description = catData?.description || "Latest intelligence, verified data, and policy updates.";

    // Get related data signals
    const categorySignals = homepageConfig.dataSignals.filter(s => s.relatedCategoryId === category);

    // Featured Logic:
    // When multiple articles are marked as featured, show the one with the newest display date.
    // 1. Get all articles marked 'isFeaturedCategory'
    const featuredCandidates = filteredArticles.filter(a => a.isFeaturedCategory);

    // 2. Sort them by display 'date' (newest display date first) or fallback to 'createdAt'
    featuredCandidates.sort((a, b) => {
        return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
    });

    // 3. Pick the winner, or fallback to the first article in the date-sorted feed
    const heroArticle = featuredCandidates[0] || filteredArticles[0];

    // Priority: Hero Image > Category Image > Default Placeholder
    const headerImage = heroArticle?.imageUrl || catData?.imageUrl || "https://placehold.co/1200x800?text=Default+Category";

    // Editorial Logic: Row 1 Priority (Policy, Signal, Analysis)
    const remainingPool = filteredArticles.filter(a => a.id !== heroArticle?.id);
    const excludeIds = new Set<string>([heroArticle?.id || '']);

    const getPriorityArticle = (type: string) => {
        const match = remainingPool.find(a => a.articleType === type && !excludeIds.has(a.id));
        if (match) excludeIds.add(match.id);
        return match;
    };

    const priorityArticles = [
        getPriorityArticle('Policy Brief'),
        getPriorityArticle('Data Signal'),
        getPriorityArticle('In-Depth Analysis')
    ].filter(Boolean) as Article[];

    const chronologicalRest = remainingPool.filter(a => !excludeIds.has(a.id));

    // Combine: Priority Row 1 + Chronological Rest
    // Note: If priority articles are missing, standard chronological articles will fill their spots naturaly.
    let gridArticles = [...priorityArticles, ...chronologicalRest];

    return (
        <div className="min-h-screen bg-black pt-36 md:pt-28 pb-20">
            <div className="container mx-auto px-4 md:px-8">

                {/* Unified Hero Section: Shared Background for Explainer and Hero Article */}
                <div className="relative w-full rounded-2xl overflow-hidden mb-8 min-h-[400px] flex items-center group/hero">

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
                    <div className="relative z-10 w-full p-6 md:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                        {/* Left: Explainer Text */}
                        <div className="flex flex-col justify-center">
                            <span className="text-news-accent text-[10px] font-bold uppercase tracking-widest mb-2 block bg-black/50 backdrop-blur w-fit px-1.5 py-0.5 rounded border border-news-accent/20">
                                Intelligence Overview
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-[0.9] tracking-tight drop-shadow-2xl">
                                {category}
                            </h1>
                            <div className="h-1 w-16 bg-news-accent mb-4 shadow-[0_0_15px_#10b981]"></div>
                            <p className="text-gray-200 text-base md:text-lg font-light leading-relaxed max-w-2xl drop-shadow-lg">
                                {description}
                            </p>
                        </div>

                        {/* Right: Hero Article Card */}
                        {heroArticle ? (
                            <div
                                onClick={() => onArticleClick(heroArticle)}
                                className="group relative aspect-[4/5] md:aspect-video lg:aspect-[2/1] w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                            >
                                <img
                                    src={heroArticle.imageUrl}
                                    alt={heroArticle.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>

                                <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                                    <span className="text-news-accent text-[8px] font-bold uppercase tracking-widest mb-2 block bg-black/50 backdrop-blur w-fit px-1.5 py-0.5 rounded">
                                        Featured
                                    </span>
                                    <h2 className="text-lg md:text-2xl font-serif font-bold text-white leading-tight mb-2 group-hover:underline decoration-2 decoration-news-accent underline-offset-4 shadow-black drop-shadow-lg">
                                        {heroArticle.title}
                                    </h2>
                                    <p className="text-gray-300 line-clamp-2 text-xs md:text-sm mb-4 drop-shadow-md font-medium">
                                        {heroArticle.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                                            <span>Read Full Story</span> <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                    {/* Listen Button - Top Right Overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playArticle(heroArticle);
                                        }}
                                        disabled={isLoading && currentArticle?.id === heroArticle.id}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-20"
                                        title="Listen to story"
                                    >
                                        {isLoading && currentArticle?.id === heroArticle.id ? (
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Headphones size={16} />
                                        )}
                                    </button>
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

                {/* --- Data Pulse Strip REMOVED per user request --- */}

                {/* System Snapshot Module */}
                {HUB_METRICS[category] && (
                    <div className="mb-12 bg-zinc-900/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">System Snapshot</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Key Indicators: {category}</p>
                                </div>
                            </div>
                            {onViewDashboard && (
                                <button
                                    onClick={onViewDashboard}
                                    className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-news-accent transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/5"
                                >
                                    View Full PlanetDash <ArrowRight size={10} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                            {HUB_METRICS[category].metrics.map((m, i) => (
                                <div key={i} className="bg-black/40 rounded-lg p-4 border border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{m.label}</p>
                                    <p className={`text-xl font-serif font-bold ${m.color || 'text-white'} mb-1`}>{m.value}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] uppercase tracking-widest font-bold ${m.trendDir === 'up' && m.color !== 'text-emerald-500' ? 'text-red-500' : m.trendDir === 'down' && m.color === 'text-emerald-500' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                            {m.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-gray-400 border-t border-white/5 pt-4">
                            <span className="font-bold text-gray-300">Context:</span> {HUB_METRICS[category].summary}
                        </p>
                    </div>
                )}

                {/* --- NEW: Topic Explorer (Sub-Nav) --- */}
                {/* Key Developments Module (Blueprint Layer 3) */}
                {/* Quarterly Highlights Module (Phase 14) */}
                {(() => {
                    // 1. Determine Current Quarter
                    const now = new Date();
                    const qIndex = Math.floor(now.getMonth() / 3) + 1;
                    const currentQuarter = `Q${qIndex}-${now.getFullYear()}`;

                    // 2. Filter Highlights for this Hub & Quarter
                    const highlights = sourceArticles.filter(a => {
                        // Check category match
                        const catMatch = Array.isArray(a.category)
                            ? a.category.includes(category)
                            : a.category === category;

                        return catMatch &&
                            a.isQuarterlyHighlight &&
                            a.highlightQuarter === currentQuarter;
                    }).sort((a, b) => (b.highlightPriority || 0) - (a.highlightPriority || 0))
                        .slice(0, 4);

                    // Add to exclude list for grid
                    highlights.forEach(h => excludeIds.add(h.id));

                    if (highlights.length > 0) {
                        return (
                            <div className="mb-16">
                                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-news-accent"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                                        Key Developments This Quarter
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {highlights.map((h, i) => (
                                        <div
                                            key={h.id}
                                            onClick={() => onArticleClick(h)}
                                            className="group relative pl-4 border-l-2 border-white/10 hover:border-news-accent transition-colors cursor-pointer"
                                        >
                                            <span className="text-[9px] text-news-accent font-bold uppercase tracking-widest mb-1 block bg-news-accent/10 w-fit px-1.5 py-0.5 rounded">
                                                {h.highlightQuarter ? h.highlightQuarter.replace('-', ' ') : currentQuarter.replace('-', ' ')}
                                            </span>
                                            <h4 className="text-sm font-bold text-white mb-2 group-hover:text-news-accent transition-colors leading-tight">
                                                {h.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 leading-relaxed text-justify line-clamp-3">
                                                {h.quarterlySummaryOverride || h.excerpt}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        // Empty State (only show if we want to signal "No developments")
                        // User requirement: "If no highlights exist yet → display section header with message"
                        return (
                            <div className="mb-16">
                                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-news-accent"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                                        Key Developments This Quarter
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500 italic">
                                    No major developments flagged for {currentQuarter.replace('-', ' ')} yet.
                                </p>
                            </div>
                        );
                    }
                })()}

                {/* --- NEW: Topic Explorer (Sub-Nav) REMOVED per user request --- */}

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
                                gridClass = "col-span-2 md:col-span-2";
                                titleSize = "text-xl md:text-2xl";
                                imageHeight = "aspect-video md:aspect-[2/1]";
                                excerptClass = "line-clamp-3";
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
                                                <AdUnit format="rectangle" className="w-full h-full" slotId={ADS_CONFIG.SLOTS.CATEGORY_FEED_1} />
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`group relative bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${gridClass}`}
                                        onClick={() => onArticleClick(article)}
                                    >
                                        <div className={`w-full overflow-hidden bg-zinc-900 ${imageHeight} ${index === 0 ? 'md:h-full' : ''} relative`}>
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                decoding="async"
                                            />
                                            {index === 0 && (
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                                            )}

                                            {/* Article Type Badge - Top Left */}
                                            {article.articleType && (
                                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500/90 backdrop-blur border border-emerald-500 rounded text-[9px] font-bold uppercase tracking-widest text-white shadow-lg z-10">
                                                    {article.articleType}
                                                </span>
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
                                            {index === 0 && (
                                                <div className="mt-auto pt-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <span>{article.date.split(',')[0]}</span>
                                                    </div>
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
                    <AdUnit format="horizontal" className="h-32" slotId={ADS_CONFIG.SLOTS.CATEGORY_FOOTER} />
                </div>

                {/* Related Systems Cross-Links (Blueprint Layer 5) */}
                {HUB_RELATED[category] && (
                    <div className="mt-20 border-t border-white/10 pt-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                            <Activity size={12} className="text-emerald-500" />
                            Related Systems Intelligence
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {HUB_RELATED[category].map((rel, i) => {
                                const Icon = rel.icon;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            if (onCategorySelect) {
                                                onCategorySelect(rel.label);
                                            }
                                        }}
                                        className="group cursor-pointer bg-zinc-900/30 border border-white/5 p-4 rounded-xl hover:bg-zinc-900/60 hover:border-white/10 transition-all flex items-center gap-4"
                                    >
                                        <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-emerald-500/80">{rel.context}</p>
                                            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white">{rel.label}</h4>
                                        </div>
                                        <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-emerald-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryFeed;