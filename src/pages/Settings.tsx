import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Cpu, Radio, Sparkles, CheckCircle2, ShieldCheck, Moon, Sun, Volume2, ArrowRight, Pill, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { notificationSound, requestBrowserNotificationPermission } from '../utils/notificationAudio';

export const Settings: React.FC = () => {
  const { settings, updateSettings, addToast, reminders } = useApp();
  const { t } = useLanguage();

  const [espIp, setEspIp] = useState(settings.esp32IpAddress);
  const [espPort, setEspPort] = useState(settings.esp32Port);
  const [highTemp, setHighTemp] = useState(settings.highTempThresholdC);
  const [lowSpO2, setLowSpO2] = useState(settings.lowSpO2Threshold);
  const [calibrationOffset, setCalibrationOffset] = useState(settings.tempCalibrationOffsetC);
  const [audioEnabled, setAudioEnabled] = useState(settings.audioAlertsEnabled);
  const [permState, setPermState] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermState(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermState(res);
    if (res === 'granted') {
      addToast('Notifications Enabled', 'Desktop notifications are active for daily medication and vitals alarms.', 'success');
    } else {
      addToast('Permission Required', 'Browser notification permission was not granted.', 'warning');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      esp32IpAddress: espIp,
      esp32Port: espPort,
      highTempThresholdC: highTemp,
      lowSpO2Threshold: lowSpO2,
      tempCalibrationOffsetC: calibrationOffset,
      audioAlertsEnabled: audioEnabled,
    });
    addToast(t('common.save', 'Save'), 'Settings saved successfully!', 'success');
  };

  const testGeminiStatus = async () => {
    addToast('Testing Gemini API', 'Sending test payload to server-side Gemini endpoint...', 'info');
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: { name: 'Test', age: 30, gender: 'Male', symptoms: [], existingDiseases: [] },
          vitals: { bodyTempC: 36.6, heartRate: 70, spO2: 98 },
        }),
      });
      if (res.ok) {
        addToast('Gemini API Active', 'Server-side Gemini 3.6 Flash connection is operational!', 'success');
      } else {
        addToast('Gemini Fallback', 'API key active with local clinical fallback.', 'warning');
      }
    } catch {
      addToast('Gemini Fallback', 'Local AI analysis fallback active.', 'warning');
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <SettingsIcon className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>{t('settings.badge', 'System & Hardware Preferences')}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('settings.title', 'Application Settings')}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {t('settings.subtitle', 'Configure language, theme, ESP32 IP endpoints, alarm buzzer thresholds, and sensor calibration.')}
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Language Preferences Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t('settings.languagePrefTitle', 'Language Preferences (भाषा / ଭାଷା)')}</span>
            </h3>
            <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold">
              EN • HI • OD
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('settings.languagePrefDesc', 'Select your preferred language for the entire Aura Health interface.')}
          </p>
          <LanguageSelector variant="settings" />
        </div>

        {/* Appearance & Audio */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{t('settings.themeTitle', 'Display Theme')} & {t('settings.audibleAlertsTitle', 'Audible Buzzer Alerts')}</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-2">
                {t('settings.themeDesc', 'Switch between Dark and Light color palettes.')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    settings.theme === 'light'
                      ? 'bg-amber-50/70 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-amber-200 shadow-xs text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">
                      ☀️ {t('nav.lightMode', 'Light')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Clinical Daylight Mode</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    settings.theme === 'dark'
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-xs ring-2 ring-cyan-500/30'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-400 shadow-xs">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">
                      🌙 {t('nav.darkMode', 'Dark')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Medical Dark Room Mode</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {t('settings.audibleAlertsTitle', 'Audible Buzzer Alerts')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('settings.audibleAlertsDesc', 'Play alarm beeps when abnormal vitals detected')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-600 dark:accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ESP32 Hardware Endpoint Config */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t('settings.esp32ConfigTitle', 'ESP32 Network Endpoint Configuration')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                {t('settings.esp32IpLabel', 'ESP32 IP Address')}
              </label>
              <input
                type="text"
                value={espIp}
                onChange={(e) => setEspIp(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                {t('settings.esp32PortLabel', 'REST Server Port')}
              </label>
              <input
                type="number"
                value={espPort}
                onChange={(e) => setEspPort(parseInt(e.target.value) || 3000)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Clinical Vital Alarm Thresholds */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{t('settings.clinicalAlarmThresholdsTitle', 'Clinical Alarm Thresholds & Calibration')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('settings.highTempAlertLabel', 'High Fever Alert (°C)')}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">{highTemp}°C</span>
              </div>
              <input
                type="range"
                min="37.5"
                max="39.5"
                step="0.1"
                value={highTemp}
                onChange={(e) => setHighTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-500 dark:accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('settings.lowSpO2AlertLabel', 'Low Oxygen Saturation Alert (%)')}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono">{lowSpO2}%</span>
              </div>
              <input
                type="range"
                min="88"
                max="96"
                value={lowSpO2}
                onChange={(e) => setLowSpO2(parseInt(e.target.value))}
                className="w-full accent-rose-500 dark:accent-rose-400 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 text-xs">
              {t('settings.tempCalibrationLabel', 'MLX90614 Calibration Offset (°C)')}
            </label>
            <input
              type="number"
              step="0.1"
              value={calibrationOffset}
              onChange={(e) => setCalibrationOffset(parseFloat(e.target.value) || 0)}
              className="w-full sm:w-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
            />
          </div>
        </div>

        {/* Daily Medication & Vitals Notifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('reminders.title', 'Daily Medication & Vitals Reminders')}
              </h3>
            </div>
            <NavLink
              to="/reminders"
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage {reminders.length} Routines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('reminders.subtitle', 'Configure automated audible chimes and browser alerts for taking scheduled medications or recording vital signs with ESP32 IoT sensors.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                notificationSound.playMedicationChime();
                addToast('Harmonic Chime', 'Playing medication alert chime.', 'info');
              }}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-cyan-500 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {t('reminders.testChime', 'Test Audio Chime')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Dual harmonic chime (Web Audio)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">{t('common.test', 'Play')}</span>
            </button>

            <button
              type="button"
              onClick={handleRequestPermission}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-cyan-500 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {t('reminders.enableDesktop', 'Desktop Notifications')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                    {t('common.status', 'Status')}: {permState}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                {permState === 'granted' ? t('common.active', 'Active') : 'Request'}
              </span>
            </button>
          </div>
        </div>

        {/* AI Server Status Check */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('settings.geminiPingTitle', 'Gemini AI Status Ping')}
              </h3>
            </div>
            <button
              type="button"
              onClick={testGeminiStatus}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-cyan-500/30 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              {t('settings.testGeminiBtn', 'Test Gemini Ping')}
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Calls backend REST endpoint `/api/ai/analyze` using `@google/genai` with model `gemini-3.8-flash`.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          {t('settings.saveAllBtn', 'Save All Preferences')}
        </button>
      </form>
    </div>
  );
};
