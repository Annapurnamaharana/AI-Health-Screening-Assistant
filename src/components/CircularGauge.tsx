import React from 'react';

interface CircularGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  normalRange: [number, number];
  warningRange?: [number, number];
  icon?: React.ReactNode;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  min,
  max,
  unit,
  label,
  sublabel,
  size = 180,
  strokeWidth = 14,
  normalRange,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Map value to percentage
  const clampedVal = Math.max(min, Math.min(max, value));
  const percentage = (clampedVal - min) / (max - min);
  const strokeDashoffset = circumference - percentage * circumference;

  // Determine color status
  let colorClass = 'stroke-emerald-600 dark:stroke-emerald-400 text-emerald-600 dark:text-emerald-400';
  let glowColor = 'shadow-xs';
  let statusText = 'Normal';

  if (value < normalRange[0] || value > normalRange[1]) {
    if (value < normalRange[0] - 5 || value > normalRange[1] + 1.5) {
      colorClass = 'stroke-rose-600 dark:stroke-rose-500 text-rose-600 dark:text-rose-500';
      glowColor = 'shadow-xs';
      statusText = 'Critical';
    } else {
      colorClass = 'stroke-amber-500 dark:stroke-amber-400 text-amber-600 dark:text-amber-400';
      glowColor = 'shadow-xs';
      statusText = 'Warning';
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md ${glowColor} transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Value Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-700 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Contents */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {icon && <div className="mb-1">{icon}</div>}
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">{value}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{unit}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">{label}</span>
          <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            statusText === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' :
            statusText === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' :
            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 animate-pulse'
          }`}>
            {statusText}
          </span>
        </div>
      </div>
      {sublabel && <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-3 font-medium">{sublabel}</span>}
    </div>
  );
};
