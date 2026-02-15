
import React from 'react';
import { AiInsight } from '@/types';

interface AiInsightsProps {
  insight: AiInsight | null;
  loading: boolean;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl animate-pulse">
        <div className="h-4 bg-indigo-700/50 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-indigo-700/50 rounded w-1/2"></div>
      </div>
    );
  }

  if (!insight) return null;

  const trendStyles = {
    up: { color: 'text-rose-400', label: 'En aumento', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    down: { color: 'text-emerald-400', label: 'En descenso', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' },
    stable: { color: 'text-amber-400', label: 'Estable', icon: 'M5 12h14' }
  };

  const style = trendStyles[insight.trend];

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl mb-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-500/30 p-2 rounded-lg">
          <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Inteligencia Artificial</span>
      </div>

      <h4 className="text-xl font-bold mb-2 leading-tight">
        {insight.summary}
      </h4>

      <div className="flex items-center gap-2 mb-4">
        <svg className={`w-5 h-5 ${style.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={style.icon} />
        </svg>
        <span className={`text-sm font-semibold ${style.color}`}>{style.label}</span>
      </div>

      <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
        "{insight.advice}"
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <span className="block text-xs font-medium text-indigo-300 mb-1">Próximo paso sugerido:</span>
        <p className="text-sm font-medium">{insight.suggestedAction}</p>
      </div>
    </div>
  );
};

export default AiInsights;
