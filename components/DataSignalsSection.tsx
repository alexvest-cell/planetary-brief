import React from 'react';
import { DataSignal } from '../data/homepageConfig';
import { ArrowRight, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ExplanationData } from '../types';

interface DataSignalsSectionProps {
  signals: DataSignal[];
  onExplain: (data: ExplanationData) => void;
  onTagClick?: (tagSlug: string) => void;
  onViewDashboard?: () => void;
}

const DataSignalsSection: React.FC<DataSignalsSectionProps> = ({ signals, onExplain, onTagClick, onViewDashboard }) => {
  if (!signals || signals.length === 0) return null;

  const colorStyles: Record<string, string> = {
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  const trendColors: Record<string, string> = {
    red: 'text-red-500',
    green: 'text-green-500',
    amber: 'text-amber-500',
    blue: 'text-blue-500',
  };

  const handleCardClick = (signal: DataSignal) => {
    if (onTagClick && signal.tagSlug) {
      onTagClick(signal.tagSlug);
    } else {
      // Fallback to explanation if no tag slug (though type enforces it now)
      onExplain({
        title: signal.label,
        value: signal.value,
        trend: signal.change,
        icon: Activity,
        color: signal.color,
        detailedInfo: {
          definition: signal.description || 'Key planetary indicator.',
          context: 'Global environmental monitoring.',
          impact: 'Critical for assessing earth system stability.'
        }
      });
    }
  };

  return (
    <section className="py-16 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-900/10 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold tracking-widest uppercase text-xs mb-2">
              <Activity size={14} />
              <span>Planetary Metrics</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Data Signals & Systems</h2>
          </div>
          <button
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            onClick={() => onViewDashboard ? onViewDashboard() : window.location.href = '/dashboard'}
          >
            <span>View Dashboard</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((signal) => (
            <button
              key={signal.id}
              onClick={() => handleCardClick(signal)}
              className="group cursor-pointer bg-zinc-900/30 border border-white/10 hover:border-amber-500/50 hover:bg-zinc-900/50 transition-all duration-300 rounded-xl p-6 flex flex-col items-start relative overflow-hidden w-full text-left"
            >
              <div className={`absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity ${trendColors[signal.color] || 'text-gray-500'}`}>
                {signal.trend === 'up' && <TrendingUp size={20} />}
                {signal.trend === 'down' && <TrendingDown size={20} />}
                {signal.trend === 'neutral' && <Minus size={20} />}
              </div>

              <span className="text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">{signal.label}</span>

              <div className="text-3xl font-bold text-white font-serif mb-2 group-hover:text-amber-400 transition-colors">
                {signal.value}
              </div>

              <div className={`text-xs font-bold px-2 py-1 rounded border ${colorStyles[signal.color] || colorStyles.blue}`}>
                {signal.change}
              </div>

              {signal.description && (
                <p className="mt-4 text-xs text-gray-500 line-clamp-2">
                  {signal.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataSignalsSection;
