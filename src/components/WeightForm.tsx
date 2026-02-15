
import React, { useState } from 'react';
import { WeightEntry } from '@/types';

interface WeightFormProps {
  onAddEntry: (entry: Omit<WeightEntry, 'id'>) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onAddEntry }) => {
  const [weight, setWeight] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || isNaN(parseFloat(weight))) return;

    onAddEntry({
      weight: parseFloat(weight),
      date: new Date(date).toISOString(),
      note: note.trim()
    });

    setWeight('');
    setNote('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
      <h3 className="text-gray-800 dark:text-white font-bold mb-6 flex items-center gap-2 text-xl">
        Nuevo Registro
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="75.5"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Fecha</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Nota (opcional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Después de entrenar..."
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  );
};

export default WeightForm;
