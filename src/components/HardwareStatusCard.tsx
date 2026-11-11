import React from 'react';
import { Cpu, Radio, Thermometer, Tv, Bell, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { HardwareModule } from '../types';
import { useApp } from '../context/AppContext';

interface HardwareStatusCardProps {
  module: HardwareModule;
}

export const HardwareStatusCard: React.FC<HardwareStatusCardProps> = ({ module }) => {
  const { testHardwareComponent } = useApp();

  const getIcon = () => {
    switch (module.type) {
      case 'MCU':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Sensor':
        return module.name.includes('Thermal') ? (
          <Thermometer className="w-5 h-5 text-amber-400" />
        ) : (
          <Radio className="w-5 h-5 text-rose-400" />
        );
      case 'Display':
        return <Tv className="w-5 h-5 text-blue-400" />;
      case 'Output':
        return module.name.includes('Buzzer') ? (
          <Bell className="w-5 h-5 text-purple-400" />
        ) : (
          <Lightbulb className="w-5 h-5 text-emerald-400" />
        );
      default:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
    }
  };

  const isOnline = module.status === 'Connected' || module.status === 'Online';

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">{getIcon()}</div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{module.name}</h4>
              <span className="text-[11px] font-mono text-cyan-400">{module.model}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isOnline ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {module.status}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed my-2">{module.description}</p>

        <div className="mt-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            GPIO Wiring Pins:
          </span>
          <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate">
            {module.pins}
          </code>
        </div>
      </div>

      {/* Action Test Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
        {module.name.includes('Buzzer') && (
          <button
            onClick={() => testHardwareComponent('buzzer')}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
          >
            Test Beep Tone
          </button>
        )}
        {module.name.includes('RGB') && (
          <button
            onClick={() => testHardwareComponent('led', 'Red')}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
          >
            Test LED Cycle
          </button>
        )}
        {module.name.includes('OLED') && (
          <button
            onClick={() => testHardwareComponent('oled', 'HealthPulse AI Ready')}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
          >
            Send OLED Msg
          </button>
        )}
      </div>
    </div>
  );
};
