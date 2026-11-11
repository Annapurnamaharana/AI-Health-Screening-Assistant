import React, { useState } from 'react';
import { Cpu, Copy, Check, Terminal, FileCode2, Layers, Zap } from 'lucide-react';
import { ESP32_HARDWARE_PINOUT, SAMPLE_ESP32_ARDUINO_CODE } from '../data/hardwareDocs';
import { useApp } from '../context/AppContext';

export const About: React.FC = () => {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(SAMPLE_ESP32_ARDUINO_CODE);
    setCopied(true);
    addToast('Code Copied', 'ESP32 C++ Arduino IDE code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Engineering Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">About Aura Health Project</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
          Diploma / Final-Year Engineering Project architecture combining embedded microcontrollers (ESP32 DevKit V1) with medical optical & infrared sensors, RESTful backend microservices, and Google Gemini artificial intelligence.
        </p>
      </div>

      {/* System Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Embedded IoT Layer</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The ESP32 reads high-frequency photoplethysmogram (PPG) signals from MAX30102 and contactless infrared skin temperature from MLX90614 over an I2C fast-mode bus (400 kHz).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Full-Stack Web API</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Node.js & Express handle RESTful sensor data intake (`/api/sensor-data`), real-time status polling (`/api/live`), and report record persistence with client-side state fallbacks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Gemini AI Engine</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Server-side Google GenAI SDK generates structured multi-part clinical reports, differential diagnosis suggestions, lifestyle guidance, and doctor warning triggers.
          </p>
        </div>
      </div>

      {/* Pinout Wiring Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <span>ESP32 Hardware Pin Connections</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ESP32_HARDWARE_PINOUT.sensors.map((sensor, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sensor.name}</h4>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-blue-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-800">
                  {sensor.interface}
                </span>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                {sensor.connections.map((conn, cIdx) => (
                  <li key={cIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
                    <span>{conn}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Arduino Firmware Code Block */}
      <div id="code" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Arduino IDE Firmware C++ Code</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Copy & flash directly to your ESP32 DevKit V1 board.</p>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Code Copied!' : 'Copy C++ Code'}</span>
          </button>
        </div>

        <div className="relative rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-emerald-400 dark:text-emerald-300 max-h-[450px] overflow-y-auto shadow-inner">
          <pre>{SAMPLE_ESP32_ARDUINO_CODE}</pre>
        </div>
      </div>
    </div>
  );
};
