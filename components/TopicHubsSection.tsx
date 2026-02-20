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

    return (
        <section className="w-full bg-zinc-950 pt-8 pb-12 md:pt-16 md:pb-32 border-t border-white/5">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-8 md:mb-16">
                    <span className="text-zinc-500 font-bold tracking-widest uppercase text-[10px] md:text-xs">Intelligence Architecture</span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mt-2 md:mt-6">{title}</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                    {categories.map((category) => {
                        return (
                            <div
                                key={category.id}
                                onClick={() => onCategoryClick(category.id)}
                                className="group relative flex flex-col justify-between p-4 md:p-6 lg:p-8 cursor-pointer border border-white/10 hover:border-white/20 transition-colors duration-300 min-h-[180px] md:min-h-0"
                            >
                                <div>
                                    <div className="w-4 h-px bg-news-accent mb-4 md:mb-6 group-hover:w-8 transition-all duration-300"></div>
                                    <h3 className="text-sm sm:text-lg md:text-2xl font-serif font-bold text-white mb-2 md:mb-4 leading-tight">
                                        {category.label}
                                    </h3>
                                    <p className="text-zinc-400 text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed md:line-clamp-none line-clamp-3 mb-6 md:mb-8">
                                        {category.shortDescription}
                                    </p>
                                </div>

                                <div className="flex items-center text-[8px] sm:text-[10px] font-bold tracking-widest uppercase text-news-accent group-hover:text-emerald-400 transition-colors">
                                    <span className="hidden sm:inline">Sector Overview</span>
                                    <span className="sm:hidden">Overview</span>
                                    <ArrowRight size={10} className="md:w-3 md:h-3 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
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
