import React, { useState } from 'react';
import { Archive, Calendar, Search } from 'lucide-react';
import { Article } from '../types';

interface ArchivesProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
}

const Archives: React.FC<ArchivesProps> = ({ articles, onArticleClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedHub, setSelectedHub] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedReadTime, setSelectedReadTime] = useState<string>('all');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Extract unique years from articles
    const years: number[] = Array.from(new Set(
        articles.map(a => {
            const dateStr = a.date || a.createdAt || '';
            const year = new Date(dateStr).getFullYear();
            return isNaN(year) ? 2026 : year;
        }) as Iterable<number>
    )).sort((a, b) => b - a);

    // Extract unique labels for filters
    const allHubs = Array.from(new Set(articles.flatMap(a => Array.isArray(a.category) ? a.category : [a.category]))).sort();
    const allTypes = Array.from(new Set(articles.map(a => a.articleType).filter(Boolean))) as string[];

    // Filter articles by multi-criteria
    const filteredArticles = articles.filter(article => {
        // Search
        const matchesSearch = searchQuery === '' ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        // Year
        const articleYear = new Date(article.date || article.createdAt || '').getFullYear();
        const matchesYear = selectedYear === 'all' || articleYear.toString() === selectedYear;

        // Hub (Category)
        const categories = Array.isArray(article.category) ? article.category : [article.category];
        const matchesHub = selectedHub === 'all' || categories.includes(selectedHub);

        // Article Type
        const matchesType = selectedType === 'all' || article.articleType === selectedType;

        // Reading Time 
        // Logic: Extract number from "X min read"
        const readTimeMinutes = parseInt((article.originalReadTime || '').replace(/[^0-9]/g, '')) || 5;
        let matchesReadTime = true;
        if (selectedReadTime === 'short') matchesReadTime = readTimeMinutes <= 5;
        else if (selectedReadTime === 'medium') matchesReadTime = readTimeMinutes > 5 && readTimeMinutes <= 10;
        else if (selectedReadTime === 'long') matchesReadTime = readTimeMinutes > 10;

        // Region (Geographic Scope)
        // Simplification: Check entities for region-like keywords if no explicit field exists
        const matchesRegion = selectedRegion === 'all' ||
            (article.entities && article.entities.some(e => e.toLowerCase().includes(selectedRegion.toLowerCase())));

        return matchesSearch && matchesYear && matchesHub && matchesType && matchesReadTime && matchesRegion;
    }).sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
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
        <div className="min-h-screen bg-black text-white pt-20 md:pt-36 pb-20">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                {/* Back Button */}

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Archive size={32} className="text-emerald-500" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Archives</h1>
                </div>

                <p className="text-gray-400 text-lg mb-12">
                    Browse our complete collection of environmental intelligence and analysis.
                </p>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {/* Search - Spans 2 cols on small+, full on mobile */}
                    <div className="sm:col-span-2 relative">
                        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    {/* Hub Filter */}
                    <div className="relative">
                        <select
                            value={selectedHub}
                            onChange={(e) => setSelectedHub(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Hubs</option>
                            {allHubs.map(hub => (
                                <option key={hub} value={hub}>{hub}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Hub</div>
                    </div>

                    {/* Article Type Filter */}
                    <div className="relative">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">Any Type</option>
                            {allTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Type</div>
                    </div>

                    {/* Year Filter */}
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year.toString()}>{year}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Year</div>
                    </div>

                    {/* Reading Time */}
                    <div className="relative">
                        <select
                            value={selectedReadTime}
                            onChange={(e) => setSelectedReadTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">Any Length</option>
                            <option value="short">Short (&lt; 5m)</option>
                            <option value="medium">Medium (5-10m)</option>
                            <option value="long">Deep Dive (&gt; 10m)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Length</div>
                    </div>

                    {/* Region Filter */}
                    <div className="relative">
                        <label className="sr-only">Region</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="all">Global Scope</option>
                            <option value="EU">European Union</option>
                            <option value="US">North America</option>
                            <option value="Global">International</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Scope</div>
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black px-1">Sort</div>
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
