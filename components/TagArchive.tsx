import React, { useEffect, useState } from 'react';
import { ArrowLeft, Tag, Filter, FileText } from 'lucide-react';
import { Article } from '../types';
import { getTagBySlug, tagLabelToSlug, TagDefinition } from '../data/tagDictionary';
import { CATEGORY_COLORS } from '../data/categories';
import { updateMetaTags } from '../utils/seoUtils';

interface TagArchiveProps {
    tagSlug: string;
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onBack: () => void;
    onCategoryClick?: (category: string) => void;
}

const TagArchive: React.FC<TagArchiveProps> = ({ tagSlug, articles, onArticleClick, onBack, onCategoryClick }) => {
    const [filterType, setFilterType] = useState<string>('all');
    const tagDef = getTagBySlug(tagSlug);

    // Find articles that have this tag in their secondaryTopics
    const matchingArticles = articles.filter(article => {
        if (!article.secondaryTopics) return false;

        // Handle multiple formats (array, single comma-separated string, etc.)
        let topics: string[] = [];
        if (Array.isArray(article.secondaryTopics)) {
            topics = article.secondaryTopics.flatMap(t =>
                typeof t === 'string' ? t.split(/[,;]/).map(s => s.trim()).filter(s => s) : []
            );
        } else if (typeof article.secondaryTopics === 'string') {
            topics = (article.secondaryTopics as string).split(/[,;]/).map(s => s.trim()).filter(s => s);
        }

        // Match by slug or by label (case-insensitive)
        return topics.some(t => {
            const topicSlug = tagLabelToSlug(t);
            return topicSlug === tagSlug || (tagDef && t.toLowerCase() === tagDef.label.toLowerCase());
        });
    });

    // Get unique article types for filter
    const articleTypes = [...new Set(matchingArticles.map(a => a.articleType).filter(Boolean))] as string[];

    // Apply article type filter
    const filteredArticles = filterType === 'all'
        ? matchingArticles
        : matchingArticles.filter(a => a.articleType === filterType);

    // Sort by date (newest first)
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return dateB - dateA;
    });

    // SEO meta tags
    useEffect(() => {
        if (tagDef) {
            updateMetaTags({
                title: `${tagDef.label} — Articles & Analysis | Planetary Brief`,
                description: tagDef.description,
                canonicalUrl: `https://planetarybrief.com/tag/${tagSlug}`,
            });
        }
        window.scrollTo(0, 0);
    }, [tagSlug, tagDef]);

    const displayLabel = tagDef?.label || tagSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const displayDescription = tagDef?.description || '';
    const hubLabel = tagDef?.hub || '';

    return (
        <div className="min-h-screen bg-zinc-950 text-white animate-fade-in">
            <div className="max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-12 md:pt-40 md:pb-24">

                {/* Header */}
                <div className="mb-10 md:mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <Tag size={16} className="text-emerald-500" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">Topic Tag</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
                        {displayLabel}
                    </h1>
                    {displayDescription && (
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
                            {displayDescription}
                        </p>
                    )}
                    {hubLabel && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Primary Hub:</span>
                            <button
                                onClick={() => onCategoryClick?.(hubLabel)}
                                className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 hover:text-white transition-colors"
                            >
                                {hubLabel}
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Bar */}
                {articleTypes.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 border-b border-white/10 pb-4">
                        <Filter size={12} className="text-gray-500" />
                        <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mr-2">Filter by type:</span>
                        <button
                            onClick={() => setFilterType('all')}
                            className={`whitespace-nowrap flex-shrink-0 px-2.5 py-1 md:px-3 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-wider border transition-all ${filterType === 'all'
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                }`}
                        >
                            All ({matchingArticles.length})
                        </button>
                        {articleTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`whitespace-nowrap flex-shrink-0 px-2.5 py-1 md:px-3 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-wider border transition-all ${filterType === type
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                    }`}
                            >
                                {type} ({matchingArticles.filter(a => a.articleType === type).length})
                            </button>
                        ))}
                    </div>
                )}

                {/* Article Count */}
                <div className="mb-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        {sortedArticles.length} {sortedArticles.length === 1 ? 'article' : 'articles'}
                    </span>
                </div>

                {/* Article List */}
                {sortedArticles.length === 0 ? (
                    <div className="text-center py-20">
                        <Tag size={32} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No articles found for this tag yet.</p>
                        <p className="text-gray-600 text-xs mt-2">Check back as new content is published.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedArticles.map((article) => {
                            const categoryLabel = Array.isArray(article.category) ? article.category[0] : article.category;
                            const catColor = CATEGORY_COLORS[categoryLabel as keyof typeof CATEGORY_COLORS] || '#10b981';

                            return (
                                <article
                                    key={article.id}
                                    onClick={() => onArticleClick(article)}
                                    className="group cursor-pointer flex gap-5 md:gap-8 p-4 md:p-5 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                                        <img
                                            src={article.originalImageUrl || article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col justify-center flex-grow min-w-0">
                                        {/* Meta row */}
                                        <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mb-1.5 md:mb-2">
                                            <span
                                                className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold"
                                                style={{ color: catColor }}
                                            >
                                                {categoryLabel}
                                            </span>
                                            {article.articleType && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0"></span>
                                                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-emerald-400">
                                                        {article.articleType}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[13px] md:text-lg font-serif font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3 md:line-clamp-2 mb-1.5 md:mb-2">
                                            {article.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed line-clamp-2 hidden md:block">
                                            {article.excerpt}
                                        </p>

                                        {/* Date & read time */}
                                        <div className="flex items-center gap-2 md:gap-3 mt-auto text-[8px] md:text-[10px] uppercase tracking-wider font-bold text-gray-600">
                                            <span>{article.date}</span>
                                            {article.originalReadTime && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                    <span className="flex items-center gap-1"><FileText size={9} /> {article.originalReadTime}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagArchive;
