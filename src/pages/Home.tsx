import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Stethoscope,
  LayoutDashboard,
  Radio,
  Cpu,
  BrainCircuit,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Activity,
  Heart,
  Thermometer,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { DailyHealthInsightWidget } from '../components/DailyHealthInsightWidget';
import { DailyRemindersWidget } from '../components/DailyRemindersWidget';

export const Home: React.FC = () => {
  const { currentVitals, hardwareState } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{t('home.heroBadge', 'ESP32 IoT Sensors + Google Gemini AI Engine')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                AI Health Screening <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t(
                  'home.heroSubtitle',
                  'An IoT and AI-based health screening system that monitors basic vital signs, records symptoms, and provides a preliminary health assessment with clear recommendations and digital reports.'
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <NavLink
                  to="/health-screening"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 dark:text-slate-950 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.01]"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>{t('home.startPatientScreening', 'Start Patient Screening')}</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-xs transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>{t('home.viewAnalytics', 'View Analytics Dashboard')}</span>
                </NavLink>
              </div>

              {/* Hardware Quick Status Pills */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">{t('home.esp32Status', 'ESP32 Status')}</span>
                  <span className={`text-xs font-bold ${hardwareState.esp32 === 'Connected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {hardwareState.esp32}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">SpO2 / {t('common.heartRate', 'Heart Rate')}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-cyan-400">{t('home.spo2Ready', 'MAX30102 Ready')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">{t('home.bodyTemp', 'Body Temp')} IR</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{t('home.tempReady', 'MLX90614 Ready')}</span>
                </div>
              </div>
            </div>

            {/* Right Live Vitals Preview Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl relative space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-blue-600 dark:text-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('home.liveTelemetry', 'Live ESP32 Telemetry')}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    {hardwareState.ipAddress}
                  </span>
                </div>

                {/* Vitals Snapshot */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">{t('home.bodyTemp', 'Body Temp')}</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{currentVitals.bodyTempC}°C</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{currentVitals.bodyTempF}°F</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400">
                      <Heart className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">{t('home.heartRate', 'Heart Rate')}</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{currentVitals.heartRate} <span className="text-xs font-normal text-slate-500">BPM</span></span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('home.normalSinus', 'Normal Sinus')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">{t('home.oxygenSpO2', 'Oxygen SpO2')}</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{currentVitals.spO2}%</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">{t('home.optimal', 'Optimal')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">{t('home.deviceSignal', 'Device Signal')}</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{currentVitals.wifiSignal} <span className="text-xs font-normal text-slate-500">dBm</span></span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">{t('home.lowLatency', 'Low Latency')}</span>
                    </div>
                  </div>
                </div>

                <NavLink
                  to="/live-dashboard"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-center font-semibold text-blue-700 dark:text-cyan-300 block transition-colors"
                >
                  {t('home.launchFullscreen', 'Launch Fullscreen Live Monitor →')}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Health Insight Widget & Medication/Vitals Reminders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20 space-y-6">
        <DailyHealthInsightWidget />
        <DailyRemindersWidget />
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('home.architectureTitle', 'System Architecture & Features')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            {t(
              'home.architectureSubtitle',
              'Comprehensive hardware-software integration designed for fast non-invasive screening and clinical workflow efficiency.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all space-y-3 group">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 w-fit group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.featureRegistrationTitle', 'Patient Registration')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'home.featureRegistrationDesc',
                'Register patient demographics, symptoms tags, and medical history before initiating live vital scans.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all space-y-3 group">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 w-fit group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.featureEspTitle', 'ESP32 IoT Sensors')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'home.featureEspDesc',
                'Readings streamed from MAX30102 pulse oximeter and MLX90614 IR contactless thermal sensor via I2C bus.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all space-y-3 group">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 w-fit group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.featureAiTitle', 'Gemini AI Risk Meter')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'home.featureAiDesc',
                'Server-side AI evaluates symptoms & vitals to generate risk scores, differential guidance, and lifestyle advice.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all space-y-3 group">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 w-fit group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('home.featurePdfTitle', 'Download PDF Reports')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'home.featurePdfDesc',
                'Generates formal hospital-style PDF screening certificates with doctor signature blocks and watermarks.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* AI Benefits & Hardware Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* AI Benefits Box */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                {t('home.clinicalAccuracy', 'Clinical Accuracy & Safety')}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('home.aiIntelligenceTitle', 'AI-Powered Diagnostic Intelligence')}
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'home.aiBenefit1',
                    'Multi-parameter correlation checking between temperature, heart rate, and oxygen saturation.'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'home.aiBenefit2',
                    'Tailored recommendations for hydration, rest, sleep, exercise, and diet based on screening.'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'home.aiBenefit3',
                    'Automatic trigger alert for doctor consultation whenever critical thresholds are breached.'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'home.aiBenefit4',
                    'Transparent disclaimer framework clarifying AI informational guidance boundaries.'
                  )}
                </span>
              </li>
            </ul>
          </div>

          {/* Hardware Overview Box */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('home.hardwareKit', 'Diploma Hardware Kit')}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('home.hardwareSpecTitle', 'ESP32 Hardware Specification')}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">
                  {t('home.mcuCore', 'MCU Core')}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">ESP32 DevKit V1</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">
                  {t('home.opticalSensor', 'Optical Sensor')}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">MAX30102 PPG</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">
                  {t('home.thermalIr', 'Thermal IR')}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">MLX90614 Contactless</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase block">
                  {t('home.displayAlert', 'Display & Alert')}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">OLED + Buzzer + LED</span>
              </div>
            </div>

            <NavLink
              to="/about"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <span>{t('home.exploreCode', 'Explore ESP32 Pinout & C++ Firmware Code')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Doctor Recommendation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-blue-50/70 dark:bg-gradient-to-r dark:from-slate-900 dark:via-cyan-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>{t('home.medicalOversight', 'Medical Oversight')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('home.telehealthTitle', 'Need Specialist Telehealth Consultation?')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              {t(
                'home.telehealthDesc',
                'If patient vitals indicate high fever or oxygen levels below 94%, connect directly with a qualified physician or contact emergency response.'
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100/80 dark:bg-rose-950/50 border border-rose-300/80 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:scale-105 transition-transform"
              >
                <span>{t('home.medicalEmergency', 'Medical Emergency:')}</span>
                <span className="font-mono font-bold">📞 108</span>
              </a>
              <a
                href="tel:14416"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100/80 dark:bg-cyan-950/50 border border-blue-300/80 dark:border-cyan-800 text-blue-700 dark:text-cyan-300 text-xs font-semibold hover:scale-105 transition-transform"
              >
                <span>{t('home.telehealthSupport', 'Telehealth Support:')}</span>
                <span className="font-mono font-bold">📞 14416</span>
              </a>
            </div>
          </div>

          <NavLink
            to="/contact"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs whitespace-nowrap shadow-md shadow-blue-500/20"
          >
            {t('home.contactTelehealthDoctor', 'Contact Telehealth Doctor')}
          </NavLink>
        </div>
      </section>
    </div>
  );
};
