import React from 'react';
import { CategoryDefinition } from '../data/categories';
import { ArrowRight } from 'lucide-react';

interface TopicHubsSectionProps {
    title: string;
    categories: CategoryDefinition[];
    onCategoryClick: (category: string) => void;
}

const TopicHubsSection: React.FC<TopicHubsSectionProps> = ({ title, categories, onCategoryClick }) => {
    if (!categories || categories.length === 0) return null;

    // Mapping for colors
    const getCategoryColor = (label: string) => {
        const colors: Record<string, string> = {
            'Climate & Energy Systems': '#ef4444',
            'Planetary Health & Society': '#8b5cf6',
            'Policy, Governance & Finance': '#3b82f6',
            'Biodiversity & Oceans': '#06b6d4',
            'Science & Data': '#f59e0b',
            'Technology & Innovation': '#10b981'
        };
        return colors[label] || '#10b981';
    };

    return (
        <section className="w-full bg-black py-16 border-t border-white/10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-emerald-500 font-bold tracking-widest uppercase text-xs">Intelligence Hubs</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">{title}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const accentColor = getCategoryColor(category.label);
                        return (
                            <div
                                key={category.id}
                                onClick={() => onCategoryClick(category.id)}
                                className="group relative h-64 flex flex-col justify-between p-8 rounded-xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                                style={{ borderTop: `4px solid ${accentColor}` }}
                            >
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                                        {category.label}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {category.shortDescription}
                                    </p>
                                </div>

                                <div className="flex items-center text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>
                                    <span>Explore Hub</span>
                                    <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TopicHubsSection;
