import React, { useState } from 'react';
import { ArrowLeft, Archive, Calendar, Search } from 'lucide-react';
import { Article } from '../types';

interface ArchivesProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onBack: () => void;
}

const Archives: React.FC<ArchivesProps> = ({ articles, onArticleClick, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    // Extract unique years from articles
    const years: number[] = Array.from(new Set(
        articles.map(a => {
            const dateStr = a.date || a.createdAt || '';
            const year = new Date(dateStr).getFullYear();
            return isNaN(year) ? 2026 : year;
        }) as Iterable<number>
    )).sort((a, b) => b - a);

    // Filter articles by search and year
    const filteredArticles = articles.filter(article => {
        const matchesSearch = searchQuery === '' ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        const articleYear = new Date(article.date || article.createdAt || '').getFullYear();
        const matchesYear = selectedYear === 'all' || articleYear.toString() === selectedYear;

        return matchesSearch && matchesYear;
    }).sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    // Group by month
    const groupedByMonth = filteredArticles.reduce((acc, article) => {
        const date = new Date(article.date || article.createdAt || '');
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(article);
        return acc;
    }, {} as Record<string, Article[]>);

    return (
        <div className="min-h-screen bg-black text-white pt-36 pb-20">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Archive size={32} className="text-emerald-500" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Archives</h1>
                </div>

                <p className="text-gray-400 text-lg mb-12">
                    Browse our complete collection of environmental intelligence and analysis.
                </p>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Year Filter */}
                    <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-8 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year.toString()}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-gray-500 text-sm mb-8">
                    {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </p>

                {/* Articles Grouped by Month */}
                <div className="space-y-12">
                    {(Object.entries(groupedByMonth) as [string, Article[]][]).map(([monthYear, monthArticles]) => (
                        <div key={monthYear}>
                            <h2 className="text-xl font-serif font-bold text-emerald-500 mb-6 border-b border-white/10 pb-2">
                                {monthYear}
                            </h2>
                            <div className="space-y-4">
                                {monthArticles.map(article => (
                                    <div
                                        key={article.id}
                                        onClick={() => onArticleClick(article)}
                                        className="group cursor-pointer bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-lg p-6 transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-serif font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                                                    {article.title}
                                                </h3>
                                                {article.excerpt && (
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{article.date}</span>
                                                    {article.category && (
                                                        <span className="text-emerald-600">
                                                            {Array.isArray(article.category) ? article.category[0] : article.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <Archive size={64} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archives;
