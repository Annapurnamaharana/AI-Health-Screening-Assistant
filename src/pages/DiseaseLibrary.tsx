import React, { useState } from 'react';
import { BookOpen, Search, Filter, ShieldAlert, CheckCircle2, ChevronRight, AlertCircle, X } from 'lucide-react';
import { INITIAL_DISEASE_LIBRARY } from '../data/mockData';
import { DiseaseInfo } from '../types';

export const DiseaseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const categories = ['All', 'Respiratory', 'Cardiovascular', 'Infectious', 'Metabolic', 'Environmental'];

  const filteredDiseases = INITIAL_DISEASE_LIBRARY.filter((disease) => {
    const matchesCategory = selectedCategory === 'All' || disease.category === selectedCategory;
    const matchesSearch =
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      disease.causes.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Clinical Medical Database</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Searchable Disease Encyclopedia</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Browse clinical symptoms, underlying causes, prevention strategies, treatment overviews, and sensor vital sign alert thresholds.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms, diseases, causes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            onClick={() => setSelectedDisease(disease)}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 block mb-1">
                    {disease.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                    {disease.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    disease.severity === 'Severe'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                  }`}
                >
                  {disease.severity}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Key Symptoms:</span>
                <div className="flex flex-wrap gap-1">
                  {disease.symptoms.slice(0, 3).map((sym, sIdx) => (
                    <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      {sym}
                    </span>
                  ))}
                  {disease.symptoms.length > 3 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold align-middle">+{disease.symptoms.length - 3} more</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{disease.treatmentOverview}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-blue-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View Clinical Details</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Disease Details Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase">{selectedDisease.category}</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedDisease.name}</h2>
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Symptoms & Causes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Clinical Symptoms</span>
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Etiology & Causes</span>
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {selectedDisease.causes.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prevention & Treatment */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Prevention & Prophylaxis</span>
              </h4>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {selectedDisease.prevention.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-blue-600 dark:text-cyan-400">Treatment Protocol Overview</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedDisease.treatmentOverview}</p>
            </div>

            <button
              onClick={() => setSelectedDisease(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer"
            >
              Close Disease Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
