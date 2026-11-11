import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, Info } from 'lucide-react';
import { RiskLevel } from '../types';

interface AIRiskMeterProps {
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
}

export const AIRiskMeter: React.FC<AIRiskMeterProps> = ({ riskLevel, riskScore }) => {
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';
  let barColor = 'from-emerald-500 to-teal-400';
  let Icon = ShieldCheck;

  if (riskLevel === 'Moderate') {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30';
    barColor = 'from-blue-500 to-cyan-500';
    Icon = Info;
  } else if (riskLevel === 'High') {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
    barColor = 'from-amber-500 to-orange-500';
    Icon = ShieldAlert;
  } else if (riskLevel === 'Critical') {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
    barColor = 'from-rose-500 to-red-600';
    Icon = AlertOctagon;
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">AI Risk Assessment Meter</h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
          {riskLevel} Risk ({riskScore}%)
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5 mb-3">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.max(5, Math.min(100, riskScore))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span>0% (Low)</span>
        <span>25% (Moderate)</span>
        <span>60% (High)</span>
        <span>100% (Critical)</span>
      </div>
    </div>
  );
};
