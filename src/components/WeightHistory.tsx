
import React from 'react';
import { WeightEntry } from '@/types';

interface WeightHistoryProps {
  entries: WeightEntry[];
  onDeleteEntry: (id: string) => void;
}

const WeightHistory: React.FC<WeightHistoryProps> = ({ entries, onDeleteEntry }) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const displayEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const exportToCsv = () => {
    if (entries.length === 0) return;

    const headers = ['Fecha', 'Peso (kg)', 'Nota'];
    const rows = sortedEntries.map(entry => [
      new Date(entry.date).toLocaleDateString('es-ES'),
      entry.weight.toString(),
      `"${(entry.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `fittrack_datos_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendByEmail = () => {
    if (entries.length === 0) return;

    const lastWeight = displayEntries[0].weight;
    const header = "Hola, este es mi progreso de peso registrado en FitTrack AI:\n\n";
    const tableHeader = "Fecha       | Peso (kg) | Notas\n--------------------------------------\n";

    const tableBody = sortedEntries.map(entry => {
      const date = new Date(entry.date).toLocaleDateString('es-ES').padEnd(12);
      const weight = entry.weight.toString().padEnd(10);
      const note = entry.note || '';
      return `${date}| ${weight}| ${note}`;
    }).join('\n');

    const footer = `\n\nTotal de registros: ${entries.length}\nÚltimo peso: ${lastWeight} kg\n\nEnviado desde FitTrack AI.`;

    const body = encodeURIComponent(header + tableHeader + tableBody + footer);
    const subject = encodeURIComponent("Mi Progreso de Peso - FitTrack AI");

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (entries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-gray-800 dark:text-white font-bold text-xl">Historial</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{entries.length} registros guardados</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={sendByEmail}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold transition-all border border-indigo-100 dark:border-indigo-900/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </button>

          <button
            onClick={exportToCsv}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all border border-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        </div>
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
            {displayEntries.map((entry) => (
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
