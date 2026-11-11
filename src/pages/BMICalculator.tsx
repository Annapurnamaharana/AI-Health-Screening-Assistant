import React, { useState } from 'react';
import { Calculator, Scale, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export const BMICalculator: React.FC = () => {
  const [unit, setUnit] = useState<'Metric' | 'Imperial'>('Metric');
  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial state
  const [heightInches, setHeightInches] = useState(68);
  const [weightLbs, setWeightLbs] = useState(154);

  let bmi = 0;
  let healthyMinKg = 0;
  let healthyMaxKg = 0;

  if (unit === 'Metric') {
    const hM = heightCm / 100;
    bmi = parseFloat((weightKg / (hM * hM)).toFixed(1));
    healthyMinKg = Math.round(18.5 * hM * hM);
    healthyMaxKg = Math.round(24.9 * hM * hM);
  } else {
    bmi = parseFloat(((703 * weightLbs) / (heightInches * heightInches)).toFixed(1));
    healthyMinKg = Math.round(((18.5 * heightInches * heightInches) / 703) * 0.453592);
    healthyMaxKg = Math.round(((24.9 * heightInches * heightInches) / 703) * 0.453592);
  }

  let category = 'Normal Weight';
  let categoryColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    categoryColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
  } else if (bmi >= 30) {
    category = 'Obese Class I/II';
    categoryColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <Calculator className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Body Mass Index & Metabolic Calculator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">BMI & Ideal Weight Analyzer</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Determine clinical weight categories, target healthy weight ranges, and personalized AI dietary/lifestyle suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Sliders */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Unit System</span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setUnit('Metric')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  unit === 'Metric'
                    ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => setUnit('Imperial')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  unit === 'Imperial'
                    ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Imperial (in / lbs)
              </button>
            </div>
          </div>

          {/* Sliders */}
          {unit === 'Metric' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Height</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Weight</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 dark:accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Height</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm">{heightInches} inches</span>
                </div>
                <input
                  type="range"
                  min="48"
                  max="88"
                  value={heightInches}
                  onChange={(e) => setHeightInches(parseInt(e.target.value))}
                  className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Weight</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{weightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="400"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 dark:accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Visual BMI Scale Bar */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Visual BMI Spectrum</span>
            <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-rose-500 relative p-0.5">
              <div
                className="w-3 h-5 bg-white rounded-full shadow-md border-2 border-slate-900 absolute -top-0.5 transition-all duration-300"
                style={{ left: `${Math.max(5, Math.min(95, ((bmi - 12) / 28) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (&gt;30)</span>
            </div>
          </div>
        </div>

        {/* Right Calculated Results & AI Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Metabolic Summary</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColor}`}>
                {category}
              </span>
            </div>

            <div className="text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                Calculated BMI
              </span>
              <span className="text-5xl font-extrabold font-mono text-slate-900 dark:text-white">{bmi}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">kg/m²</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold block">Target Healthy Weight Range:</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {healthyMinKg} kg – {healthyMaxKg} kg
              </span>
            </div>

            {/* AI Advice Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Health Suggestions</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {bmi < 18.5
                      ? 'Focus on nutrient-dense meals with healthy fats and protein to build lean muscle mass.'
                      : bmi < 25
                      ? 'Maintain current balanced dietary intake and 150 minutes of moderate weekly cardio exercise.'
                      : 'Reduce refined carbohydrates and sodium intake while aiming for 30 minutes of daily aerobic movement.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ensure at least 2.5L of water daily to support metabolic clearance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
