import React from 'react';
import { FileText, BookOpen, Activity, Cpu, ScrollText } from 'lucide-react';
import { Article } from '../types';

interface ArticleTypeBadgeProps {
    type: Article['articleType'] | string | undefined;
    className?: string;
    showIcon?: boolean;
}

const TYPE_CONFIG: Record<string, { color: string; icon: any }> = {
    'Policy Brief': { color: 'bg-blue-600/90', icon: FileText },
    'Data Signal': { color: 'bg-emerald-500/90', icon: Activity },
    'In-Depth Analysis': { color: 'bg-purple-600/90', icon: BookOpen },
    'Technology Assessment': { color: 'bg-amber-600/90', icon: Cpu },
    'Treaty Explainer': { color: 'bg-indigo-600/90', icon: ScrollText },
};

const ArticleTypeBadge: React.FC<ArticleTypeBadgeProps> = ({ type, className = "top-3 left-3", showIcon = true }) => {
    if (!type) return null;

    const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || {
        color: 'bg-zinc-800/90',
        icon: FileText
    };

    const Icon = config.icon;

    return (
        <div className={`absolute ${className} ${config.color} z-10 backdrop-blur px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-wide text-white flex items-center gap-0.5 md:gap-1 border border-white/10 shadow-lg transition-all duration-300`}>
            {showIcon && <Icon className="w-2 h-2 md:w-2.5 md:h-2.5" />}
            <span>{type}</span>
        </div>
    );
};

export default ArticleTypeBadge;
