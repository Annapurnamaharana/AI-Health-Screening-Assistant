import React from 'react';
import {
  Radio,
  Thermometer,
  Heart,
  Activity,
  Cpu,
  Wifi,
  Pause,
  Play,
  Volume2,
  Tv,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PulseWaveform } from '../components/PulseWaveform';

export const LiveDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    currentVitals,
    hardwareState,
    dataSource,
    setDataSource,
    connectHardware,
    disconnectHardware,
    isStreaming,
    toggleStreaming,
    updateVitalsManually,
    testHardwareComponent,
  } = useApp();

  const isRealSensorConnected = dataSource === 'live' && hardwareState.esp32 === 'Connected';

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold mb-2 shadow-xs">
            <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
            <span>{t('liveVitals.badge', 'Real-Time Sensor Monitoring')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('nav.liveVitals', 'Live Vitals')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            {t(
              'liveVitals.subtitle',
              'Streaming telemetry from ESP32 DevKit V1, MAX30102 pulse oximeter, and MLX90614 infrared temperature sensor.'
            )}
          </p>
        </div>

        {/* Controls: Stream Pause & Hardware Connect */}
        <div className="flex flex-wrap items-center gap-2">
          {hardwareState.esp32 === 'Connected' ? (
            <button
              type="button"
              onClick={disconnectHardware}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Disconnect ESP32
            </button>
          ) : (
            <button
              type="button"
              onClick={connectHardware}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Connect ESP32
            </button>
          )}

          <button
            type="button"
            onClick={toggleStreaming}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
            }`}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStreaming ? t('liveVitals.pauseStream', 'Pause Stream') : t('liveVitals.resumeStream', 'Resume Stream')}</span>
          </button>
        </div>
      </div>

      {/* DISTINCT DATA SOURCE CALLOUT BANNER (Requirement 7) */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
          isRealSensorConnected
            ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {isRealSensorConnected ? (
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">
                {isRealSensorConnected
                  ? `Live Sensor Data (ESP32 Hardware Connected)`
                  : `Demo Data (Simulation Mode)`}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isRealSensorConnected
                    ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                }`}
              >
                {isRealSensorConnected ? 'Hardware Active' : 'Simulated Readings'}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isRealSensorConnected
                ? 'Displaying calibrated telemetry received directly from MAX30102 and MLX90614 sensors via ESP32.'
                : 'Hardware is not currently linked. Displaying simulated telemetry for demonstration and viva testing.'}
            </p>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (dataSource === 'live') {
              setDataSource('demo');
            } else {
              setDataSource('live');
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          {dataSource === 'live' ? 'Switch to Demo Mode' : 'Switch to Live Sensor'}
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Body Temperature */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('common.bodyTemp', 'Body Temperature')}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
              {currentVitals.bodyTempC}°C
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              ({currentVitals.bodyTempF}°F)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">MLX90614 Contactless IR</span>
            <span
              className={`font-bold ${
                currentVitals.bodyTempC > 38.0
                  ? 'text-rose-600 dark:text-rose-400'
                  : currentVitals.bodyTempC > 37.5
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {currentVitals.bodyTempC > 38.0 ? 'High Fever' : currentVitals.bodyTempC > 37.5 ? 'Elevated' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('common.heartRate', 'Heart Rate (Pulse)')}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
              {currentVitals.heartRate}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">BPM</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">MAX30102 Optical PPG</span>
            <span
              className={`font-bold ${
                currentVitals.heartRate > 100 || currentVitals.heartRate < 60
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {currentVitals.heartRate > 115
                ? 'Tachycardia'
                : currentVitals.heartRate > 100
                ? 'Elevated'
                : currentVitals.heartRate < 60
                ? 'Bradycardia'
                : 'Regular Rhythm'}
            </span>
          </div>
        </div>

        {/* Oxygen SpO2 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('common.spO2', 'Blood Oxygen (SpO₂)')}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
              {currentVitals.spO2}%
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Saturation</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Red / IR Ratio</span>
            <span
              className={`font-bold ${
                currentVitals.spO2 < 92
                  ? 'text-rose-600 dark:text-rose-400'
                  : currentVitals.spO2 < 95
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {currentVitals.spO2 < 92 ? 'Low Oxygen' : currentVitals.spO2 < 95 ? 'Borderline' : 'Optimal'}
            </span>
          </div>
        </div>
      </div>

      {/* Device Status & Network Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
              Device Status
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ESP32 DevKit ({hardwareState.esp32})
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <Wifi className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
              Wi-Fi Telemetry IP
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {hardwareState.ipAddress}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <Radio className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
              Last Sensor Pulse
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {new Date(currentVitals.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Photoplethysmogram PPG Waveform Canvas */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {t('liveVitals.pulseWaveformTitle', 'Live Cardiac PPG Photoplethysmogram')}
        </h3>
        <PulseWaveform bpm={currentVitals.heartRate} height={150} />
      </div>

      {/* Interactive ESP32 Hardware Simulator Test Bench */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ESP32 Hardware Test Bench & Sensor Injector
            </h3>
          </div>
          <button
            type="button"
            onClick={() => updateVitalsManually({ bodyTempC: 36.8, heartRate: 74, spO2: 98 })}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Normal Vitals</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Test Temperature Injector</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">{currentVitals.bodyTempC}°C</span>
            </div>
            <input
              type="range"
              min="35.0"
              max="41.0"
              step="0.1"
              value={currentVitals.bodyTempC}
              onChange={(e) => updateVitalsManually({ bodyTempC: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 dark:accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Heart Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Test Heart Rate Injector</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono">{currentVitals.heartRate} BPM</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              value={currentVitals.heartRate}
              onChange={(e) => updateVitalsManually({ heartRate: parseInt(e.target.value) })}
              className="w-full accent-rose-500 dark:accent-rose-400 cursor-pointer"
            />
          </div>

          {/* SpO2 Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Test Oxygen SpO2 Injector</span>
              <span className="text-blue-600 dark:text-cyan-400 font-mono">{currentVitals.spO2}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="100"
              value={currentVitals.spO2}
              onChange={(e) => updateVitalsManually({ spO2: parseInt(e.target.value) })}
              className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Hardware Peripherals Triggers */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => testHardwareComponent('buzzer')}
            className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t('liveVitals.buzzerTest', 'Test Bedside Alarm Buzzer')}</span>
          </button>

          <button
            type="button"
            onClick={() => testHardwareComponent('oled', `Temp:${currentVitals.bodyTempC}C SpO2:${currentVitals.spO2}%`)}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span>Update OLED Screen Text</span>
          </button>
        </div>
      </div>
    </div>
  );
};
