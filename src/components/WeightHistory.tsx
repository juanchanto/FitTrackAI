
import React from 'react';
import { WeightEntry } from '@/types';

interface WeightHistoryProps {
  entries: WeightEntry[];
  onDeleteEntry: (id: string) => void;
}

const WeightHistory: React.FC<WeightHistoryProps> = ({ entries, onDeleteEntry }) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (entries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-gray-800 dark:text-white font-bold text-xl">Historial</h3>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-wider">
          {entries.length} registros
        </span>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Peso</th>
              <th className="px-6 py-4 hidden sm:table-cell">Nota</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400 font-medium">
                  {new Date(entry.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {entry.weight} <span className="text-gray-400 dark:text-slate-500 font-normal">kg</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-500 italic max-w-xs truncate hidden sm:table-cell">
                  {entry.note || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-rose-500 transition-colors"
                    title="Eliminar registro"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeightHistory;
