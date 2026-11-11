import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Thermometer,
  Heart,
  Activity,
  LayoutDashboard,
  TrendingUp,
  History,
  FileSpreadsheet,
  Download,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { CircularGauge } from '../components/CircularGauge';
import { AIRiskMeter } from '../components/AIRiskMeter';
import { generateHospitalPDFReport } from '../utils/pdfGenerator';
import { DailyRemindersWidget } from '../components/DailyRemindersWidget';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentVitals, reports, hardwareState, dataSource } = useApp();
  const { t } = useLanguage();

  const isRealSensorConnected = dataSource === 'live' && hardwareState.esp32 === 'Connected';

  // Calculate health score & risk level based on live vitals
  let overallScore = 100;
  if (currentVitals.bodyTempC > 38.0) overallScore -= 25;
  if (currentVitals.spO2 < 95) overallScore -= (95 - currentVitals.spO2) * 6;
  if (currentVitals.heartRate > 100 || currentVitals.heartRate < 60) overallScore -= 15;
  overallScore = Math.max(10, Math.min(100, Math.round(overallScore)));

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  let riskScore = 100 - overallScore;

  if (riskScore > 75) riskLevel = 'Critical';
  else if (riskScore > 50) riskLevel = 'High';
  else if (riskScore > 25) riskLevel = 'Moderate';

  // Sample 24h telemetry trend data for Recharts
  const trendData = [
    { time: '00:00', temp: 36.5, hr: 68, spO2: 98 },
    { time: '04:00', temp: 36.4, hr: 64, spO2: 99 },
    { time: '08:00', temp: 36.7, hr: 72, spO2: 97 },
    { time: '12:00', temp: currentVitals.bodyTempC, hr: currentVitals.heartRate, spO2: currentVitals.spO2 },
    { time: '16:00', temp: 37.0, hr: 78, spO2: 98 },
    { time: '20:00', temp: 36.8, hr: 71, spO2: 98 },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold mb-2 shadow-xs">
            <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t('dashboard.badge', 'Clinical Analytics Dashboard')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('nav.dashboard', 'Medical Vitals Overview')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            {t(
              'dashboard.subtitle',
              'Real-time circular metric gauges, AI risk scores, and trend visualization.'
            )}
          </p>
        </div>

        {/* Overall Health Score Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
              {t('dashboard.overallHealthScore', 'Overall Health Score')}
            </span>
            <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-cyan-400">
              {overallScore} / 100
            </span>
          </div>
          <div
            className={`w-3 h-10 rounded-full ${
              overallScore >= 80 ? 'bg-emerald-500' : overallScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
          />
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
                ? 'Showing direct live biomedical telemetry from MAX30102 and MLX90614 sensors.'
                : 'Showing simulated mock vitals for demonstration purposes. Link the ESP32 to switch to real sensor telemetry.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/health-screening')}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{t('nav.screening', 'Start Screening')}</span>
        </button>
      </div>

      {/* 3 Circular Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CircularGauge
          value={currentVitals.bodyTempC}
          min={35}
          max={42}
          unit="°C"
          label={t('common.bodyTemp', 'Body Temperature')}
          sublabel="MLX90614 Contactless IR"
          normalRange={[36.1, 37.5]}
          icon={<Thermometer className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
        />

        <CircularGauge
          value={currentVitals.heartRate}
          min={40}
          max={180}
          unit="BPM"
          label={t('common.heartRate', 'Heart Rate')}
          sublabel="MAX30102 PPG Optical"
          normalRange={[60, 100]}
          icon={<Heart className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-pulse" />}
        />

        <CircularGauge
          value={currentVitals.spO2}
          min={80}
          max={100}
          unit="%"
          label={t('common.spO2', 'Blood Oxygen (SpO₂)')}
          sublabel="Red/IR Pulse Oximetry"
          normalRange={[95, 100]}
          icon={<Activity className="w-5 h-5 text-blue-600 dark:text-cyan-400" />}
        />
      </div>

      {/* AI Risk Meter */}
      <AIRiskMeter riskLevel={riskLevel} riskScore={riskScore} />

      {/* Recharts Vital Trend Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Area Chart: HR & SpO2 */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t('dashboard.trend24h', '24-Hour Heart Rate & SpO₂ Trend')}</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Recharts Telemetry Stream</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSpO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 110]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="hr" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHR)" name="Heart Rate (BPM)" />
                <Area type="monotone" dataKey="spO2" stroke="#0284c7" fillOpacity={1} fill="url(#colorSpO2)" name="SpO₂ (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Temperature Bar */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{t('dashboard.thermometryStatus', 'Temperature Stability (°C)')}</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[35, 41]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="temp" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Body Temp (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Medication & Vitals Schedule Widget */}
      <DailyRemindersWidget />

      {/* Recent Patient Screenings Log */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t('dashboard.recentScreenings', 'Recent Screening Readings')}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {reports.length} Total Reports Saved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">{t('dashboard.reportNumber', 'Report #')}</th>
                <th className="p-3">{t('dashboard.patientCol', 'Patient Name')}</th>
                <th className="p-3">{t('dashboard.tempCol', 'Temp (°C)')}</th>
                <th className="p-3">{t('dashboard.hrCol', 'HR (BPM)')}</th>
                <th className="p-3">{t('dashboard.spo2Col', 'SpO₂ (%)')}</th>
                <th className="p-3">{t('dashboard.riskCol', 'Risk Level')}</th>
                <th className="p-3 text-right">{t('dashboard.actionCol', 'PDF Report')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {reports.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-cyan-400">{r.reportNumber}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {r.patient.name} ({r.patient.age}y/o)
                  </td>
                  <td className="p-3 font-mono">{r.vitals.bodyTempC}°C</td>
                  <td className="p-3 font-mono">{r.vitals.heartRate}</td>
                  <td className="p-3 font-mono">{r.vitals.spO2}%</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.analysis.riskLevel === 'Low'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                          : r.analysis.riskLevel === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                      }`}
                    >
                      {r.analysis.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => generateHospitalPDFReport(r)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-cyan-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
