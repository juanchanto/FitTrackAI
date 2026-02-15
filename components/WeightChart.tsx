
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { WeightEntry } from '../types';

interface WeightChartProps {
  entries: WeightEntry[];
  darkMode?: boolean;
}

const WeightChart: React.FC<WeightChartProps> = ({ entries, darkMode }) => {
  const sortedData = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const formattedData = sortedData.map(entry => ({
    ...entry,
    displayDate: new Date(entry.date).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short' 
    }),
    fullDate: new Date(entry.date).toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));

  if (entries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800">
        <p className="text-gray-400 dark:text-slate-500 font-medium">No hay datos suficientes para graficar</p>
      </div>
    );
  }

  const weights = entries.map(e => e.weight);
  const minWeight = Math.floor(Math.min(...weights) - 2);
  const maxWeight = Math.ceil(Math.max(...weights) + 2);

  const themeColors = {
    grid: darkMode ? '#1e293b' : '#f1f5f9',
    text: darkMode ? '#94a3b8' : '#64748b',
    tooltipBg: darkMode ? '#0f172a' : '#ffffff',
    tooltipBorder: darkMode ? '#1e293b' : '#f1f5f9'
  };

  return (
    <div className="w-full h-80 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
      <h3 className="text-gray-700 dark:text-slate-300 font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
        Evolución Temporal
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: themeColors.text, fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            domain={[minWeight, maxWeight]} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: themeColors.text, fontSize: 11 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              backgroundColor: themeColors.tooltipBg,
              border: `1px solid ${themeColors.tooltipBorder}`,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 'bold', color: darkMode ? '#f8fafc' : '#1e293b', marginBottom: '4px' }}
            itemStyle={{ color: '#6366f1', fontWeight: '500' }}
            formatter={(value: number) => [`${value} kg`, 'Peso']}
          />
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorWeight)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
