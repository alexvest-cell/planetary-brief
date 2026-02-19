import React from 'react';
import { Article } from '../types';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

interface InDepthAnalysisSectionProps {
    title: string;
    articles: Article[];
    onArticleClick: (article: Article) => void;
}

const InDepthAnalysisSection: React.FC<InDepthAnalysisSectionProps> = ({ title, articles, onArticleClick }) => {
    // Config passes curated articles, we just render them
    // User requested 4 articles, 2 per line on all devices
    const depthArticles = articles.slice(0, 4);

    if (!depthArticles || depthArticles.length === 0) return null;

    return (
        <section className="py-16 bg-zinc-950 border-t border-white/5">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-purple-400 font-bold tracking-widest uppercase text-xs">Deep Dives</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2 leading-tight">
                            {title}
                        </h2>
                    </div>
                    <button
                        className="hidden md:flex group items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                        onClick={() => window.location.href = '/category/guides'} // Fallback link
                    >
                        <span>Browse All Reports</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Grid: 2 columns on mobile and desktop per user request (2x2 grid) */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {depthArticles.map((article, index) => (
                        <div
                            key={article.id}
                            onClick={() => onArticleClick(article)}
                            className="group cursor-pointer flex flex-col bg-zinc-900/20 border border-white/5 hover:border-purple-500/30 transition-all duration-300 rounded-xl overflow-hidden h-full"
                        >
                            {/* Image - Stacked on top */}
                            <div className="relative aspect-[3/2] w-full overflow-hidden">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                {/* Badge - Simplified for smaller cards */}
                                <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wide text-white flex items-center gap-1.5 border border-white/10 shadow-lg">
                                    <BookOpen size={10} />
                                    <span>Analysis</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-purple-400 mb-2 font-mono uppercase tracking-wider">
                                    <span>{Array.isArray(article.category) ? article.category[0] : article.category}</span>
                                </div>

                                <h3 className="text-base md:text-xl font-serif font-bold text-white leading-tight mb-2 group-hover:text-purple-300 transition-colors line-clamp-3">
                                    {article.title}
                                </h3>

                                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3 hidden md:block">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-3 text-[9px] text-gray-500 font-mono">
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} />
                                            <span>{article.originalReadTime || '10m'}</span>
                                        </div>
                                    </div>

                                    {/* Mobile: Simple Arrow, Desktop: 'Read' */}
                                    <ArrowRight size={14} className="text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InDepthAnalysisSection;
