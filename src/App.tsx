
import React, { useState, useEffect, useCallback } from 'react';
import { WeightEntry, AiInsight } from '../types';
import WeightForm from './components/WeightForm';
import WeightChart from './components/WeightChart';
import WeightHistory from './components/WeightHistory';
import AiInsights from './components/AiInsights';
import { getWeightInsights } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'fittrack_entries_v1';
const THEME_KEY = 'fittrack_theme';

const App: React.FC = () => {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchInsights = useCallback(async (currentEntries: WeightEntry[]) => {
    if (currentEntries.length < 2) return;
    setLoadingInsights(true);
    try {
      const newInsight = await getWeightInsights(currentEntries);
      setInsight(newInsight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    if (entries.length >= 2) {
      fetchInsights(entries);
    }
  }, []);

  const handleAddEntry = (newEntry: Omit<WeightEntry, 'id'>) => {
    const entry: WeightEntry = {
      ...newEntry,
      id: crypto.randomUUID()
    };
    const updated = [...entries, entry];
    setEntries(updated);
    if (updated.length >= 2) {
      fetchInsights(updated);
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    if (updated.length < 2) {
      setInsight(null);
    } else {
      fetchInsights(updated);
    }
  };

  const lastWeight = entries.length > 0
    ? [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      <header className="bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">FitTrack <span className="text-indigo-600">AI</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {lastWeight && (
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">Último Peso</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{lastWeight} kg</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <WeightChart entries={entries} darkMode={darkMode} />
            <AiInsights insight={insight} loading={loadingInsights} />
            <WeightHistory entries={entries} onDeleteEntry={handleDeleteEntry} />
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <WeightForm onAddEntry={handleAddEntry} />
              <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mt-6">
                <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-2">Consejo Pro</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  Pésate siempre a la misma hora, preferiblemente por la mañana en ayunas, para obtener los datos más consistentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-gray-100 dark:border-slate-900 text-center text-gray-400 dark:text-slate-600 text-sm">
        <p>&copy; 2024 FitTrack AI. Desarrollado con Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
