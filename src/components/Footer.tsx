import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse, Cpu, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & Diploma Project Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <span className="text-base font-bold text-slate-900 dark:text-white">AI Health Screening Assistant</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            AI Health Screening & ESP32 IoT Medical Vitals Monitor. Continuous biomedical telemetry with MAX30102, MLX90614, and Google Gemini AI.
          </p>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ESP32 DevKit V1 | I2C Fast Bus @ 400kHz</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-slate-900 dark:text-slate-200 tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><NavLink to="/health-screening" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Patient Health Screening</NavLink></li>
            <li><NavLink to="/live-dashboard" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Live Dashboard & Vitals Stream</NavLink></li>
            <li><NavLink to="/dashboard" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Medical Analytics Dashboard</NavLink></li>
            <li><NavLink to="/reminders" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Health Reminders</NavLink></li>
            <li><NavLink to="/disease-library" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Disease Library</NavLink></li>
          </ul>
        </div>

        {/* Col 3: Hardware Specs & Docs */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-slate-900 dark:text-slate-200 tracking-wider">
            Hardware & Docs
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><NavLink to="/about" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">About AI Health Screening Assistant</NavLink></li>
            <li><NavLink to="/reports" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Downloadable Hospital PDF Reports</NavLink></li>
            <li><NavLink to="/faq" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Hardware Setup FAQ</NavLink></li>
            <li><NavLink to="/settings" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Settings & Calibration</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contact Support</NavLink></li>
          </ul>
        </div>

        {/* Col 4: Medical Disclaimer */}
        <div className="space-y-2 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Medical AI Disclaimer</span>
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
            AI Health Screening Assistant is an assistive screening tool and not a substitute for professional medical diagnosis. Consult a qualified physician for any health concerns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <a href="tel:108" className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold hover:underline">
            <span>Medical Emergency Hotline:</span>
            <span className="font-mono font-bold">📞 108</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <a href="tel:14416" className="flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 font-semibold hover:underline">
            <span>Telehealth:</span>
            <span className="font-mono font-bold">📞 14416</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/about" className="hover:text-slate-900 dark:hover:text-slate-300">About</NavLink>
          <NavLink to="/contact" className="hover:text-slate-900 dark:hover:text-slate-300">Contact</NavLink>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-3 text-[10px] text-slate-400 text-center sm:text-left">
        <p>© 2026 AI Health Screening Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
};
