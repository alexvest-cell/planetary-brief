import React from 'react';
import { Article } from '../types';
import { ArrowRight, FileText } from 'lucide-react';
import ArticleTypeBadge from './ArticleTypeBadge';

interface LatestPolicySectionProps {
    title: string;
    articles: Article[];
    onArticleClick: (article: Article) => void;
}

const LatestPolicySection: React.FC<LatestPolicySectionProps> = ({ title, articles, onArticleClick }) => {
    // Config passes us specific policy articles, so we just render them.
    // We can slice to be safe.
    const displayArticles = articles.slice(0, 4);

    if (!displayArticles || displayArticles.length === 0) return null;

    return (
        <section className="py-8 md:py-16 bg-zinc-900 border-t border-white/5">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-6 md:mb-8 gap-2 md:gap-4">
                    <div className="shrink-1 min-w-0">
                        <span className="text-blue-400 font-bold tracking-widest uppercase text-[10px] md:text-xs truncate block">Global Frameworks</span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mt-1 leading-tight">{title}</h2>
                    </div>
                    <a
                        href="/category/policy-governance-and-finance"
                        className="group flex flex-row items-center justify-end gap-1 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors shrink-0 whitespace-nowrap"
                    >
                        <span className="text-right">View All Policy</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayArticles.map((article) => (
                        <a
                            key={article.id}
                            href={`/article/${article.slug || article.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onArticleClick(article);
                            }}
                            className="group cursor-pointer flex flex-col h-full bg-black/20 border border-white/5 hover:border-blue-500/30 hover:bg-black/40 transition-all duration-300 rounded-lg overflow-hidden"
                        >
                            <div className="h-40 overflow-hidden relative">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                />
                                <ArticleTypeBadge type={article.articleType} />
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-[10px] text-blue-400 mb-2 font-mono">
                                    <span>{article.date.split(',')[0]}</span>
                                    {article.originalReadTime && (
                                        <>
                                            <span className="text-zinc-600">•</span>
                                            <span>{article.originalReadTime}</span>
                                        </>
                                    )}
                                </div>

                                <h3 className="text-lg font-serif font-bold text-white leading-snug mb-3 group-hover:text-blue-200 transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-grow font-light">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-xs font-bold text-zinc-500 group-hover:text-blue-400 transition-colors">
                                    <span>Read Analysis</span>
                                    <ArrowRight size={12} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestPolicySection;
