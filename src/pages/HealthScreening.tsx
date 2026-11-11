import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  User,
  Activity,
  Cpu,
  Plus,
  X,
  Radio,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  History,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PatientInfo, ScreeningReport } from '../types';
import { generateHospitalPDFReport } from '../utils/pdfGenerator';
import { AIRiskMeter } from '../components/AIRiskMeter';

export const HealthScreening: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    currentVitals,
    hardwareState,
    dataSource,
    setDataSource,
    connectHardware,
    disconnectHardware,
    testHardwareComponent,
    updateVitalsManually,
    createScreeningReport,
  } = useApp();

  const [patientName, setPatientName] = useState('John Doe');
  const [age, setAge] = useState(42);
  const [gender, setGender] = useState<PatientInfo['gender']>('Male');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(74);
  const [symptoms, setSymptoms] = useState<string[]>(['Fever', 'Fatigue']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [existingDiseases, setExistingDiseases] = useState<string[]>(['Hypertension']);
  const [customDisease, setCustomDisease] = useState('');
  const [notes, setNotes] = useState('');

  // Manual vital sign inputs for user calibration or hardware feed
  const [tempInput, setTempInput] = useState<number>(currentVitals.bodyTempC);
  const [hrInput, setHrInput] = useState<number>(currentVitals.heartRate);
  const [spo2Input, setSpo2Input] = useState<number>(currentVitals.spO2);

  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ScreeningReport | null>(null);

  const commonSymptoms = [
    'Fever',
    'Shortness of breath',
    'Cough',
    'Chest Pain',
    'Fatigue',
    'Headache',
    'Dizziness',
    'Chills',
    'Sore Throat',
    'Loss of Taste/Smell',
  ];

  const commonDiseases = [
    'Hypertension',
    'Diabetes Type 2',
    'Asthma',
    'COPD',
    'Heart Disease',
    'Thyroid Disorder',
  ];

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) => (prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]));
  };

  const addCustomSymptom = () => {
    if (!customSymptom.trim()) return;
    if (!symptoms.includes(customSymptom.trim())) {
      setSymptoms((prev) => [...prev, customSymptom.trim()]);
    }
    setCustomSymptom('');
  };

  const toggleDisease = (dis: string) => {
    setExistingDiseases((prev) => (prev.includes(dis) ? prev.filter((d) => d !== dis) : [...prev, dis]));
  };

  const addCustomDisease = () => {
    if (!customDisease.trim()) return;
    if (!existingDiseases.includes(customDisease.trim())) {
      setExistingDiseases((prev) => [...prev, customDisease.trim()]);
    }
    setCustomDisease('');
  };

  const handleApplyVitals = () => {
    updateVitalsManually({
      bodyTempC: tempInput,
      heartRate: hrInput,
      spO2: spo2Input,
    });
  };

  const handleScreeningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    // Synchronize vitals with current inputs
    updateVitalsManually({
      bodyTempC: tempInput,
      heartRate: hrInput,
      spO2: spo2Input,
    });

    setLoading(true);
    const patientData: PatientInfo = {
      id: `pat-${Date.now()}`,
      name: patientName.trim(),
      age,
      gender,
      heightCm,
      weightKg,
      symptoms,
      existingDiseases,
      notes,
      timestamp: new Date().toISOString(),
    };

    const report = await createScreeningReport(patientData);
    setGeneratedReport(report);
    setLoading(false);

    // Smooth scroll to the result card
    setTimeout(() => {
      document.getElementById('screening-result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <Stethoscope className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>{t('screening.badge', 'Patient Registration & Health Screening')}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('screening.title', 'Automated Patient Health Screening')}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">
          {t(
            'screening.subtitle',
            'Enter patient clinical demographics, select presenting symptoms, verify live or demo ESP32 sensor values, and run the preliminary health screening assessment.'
          )}
        </p>
      </div>

      {/* Hardware Link & Data Source Status Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
            <Cpu className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ESP32 Hardware Connector
              </h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  hardwareState.esp32 === 'Connected'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                }`}
              >
                {hardwareState.esp32 === 'Connected' ? t('common.connected', 'Connected') : t('common.disconnected', 'Disconnected')}
              </span>

              {/* Explicit Live Sensor Data vs Demo Data Indicator */}
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  dataSource === 'live' && hardwareState.esp32 === 'Connected'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                }`}
              >
                {dataSource === 'live' && hardwareState.esp32 === 'Connected'
                  ? `🟢 ${t('screening.liveSensorData', 'Live Sensor Data')}`
                  : `🟡 ${t('screening.demoData', 'Demo Data (Simulation Mode)')}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              MAX30102 ({hardwareState.max30102}) | MLX90614 ({hardwareState.mlx90614}) | OLED ({hardwareState.oledDisplay})
            </p>
          </div>
        </div>

        {/* Device Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {hardwareState.esp32 === 'Connected' ? (
            <button
              type="button"
              onClick={disconnectHardware}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              {t('common.disconnected', 'Disconnect')}
            </button>
          ) : (
            <button
              type="button"
              onClick={connectHardware}
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              {t('common.connecting', 'Connect Device')}
            </button>
          )}

          <button
            type="button"
            onClick={() => testHardwareComponent('buzzer')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {t('common.test', 'Test Buzzer Alarm')}
          </button>
        </div>
      </div>

      {/* Main Form: Demographics, Symptoms, Vitals */}
      <form onSubmit={handleScreeningSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Demographics & Symptoms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Patient Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t('screening.step1', '1. Patient Information')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('common.patientName', 'Patient Name')}
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                  placeholder={t('screening.patientNamePlaceholder', 'Enter full patient name')}
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('common.age', 'Age (Years)')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t('common.gender', 'Gender')}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as PatientInfo['gender'])}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                >
                  <option value="Male">{t('common.male', 'Male')}</option>
                  <option value="Female">{t('common.female', 'Female')}</option>
                  <option value="Other">{t('common.other', 'Other')}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 100)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Presenting Symptoms Selection */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>{t('screening.selectSymptoms', 'Select Presenting Symptoms')}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym) => {
                const selected = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selected
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/50 font-semibold'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>

            {/* Custom Symptom Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={addCustomSymptom}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Existing Diseases / History */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{t('screening.selectDiseases', 'Known Medical Conditions')}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {commonDiseases.map((dis) => {
                const selected = existingDiseases.includes(dis);
                return (
                  <button
                    key={dis}
                    type="button"
                    onClick={() => toggleDisease(dis)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selected
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/50 font-semibold'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {dis}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add condition..."
                value={customDisease}
                onChange={(e) => setCustomDisease(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={addCustomDisease}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Form: Vital Measurements & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
                <span>{t('screening.step3', '3. Vital Signs Telemetry')}</span>
              </h3>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  dataSource === 'live' && hardwareState.esp32 === 'Connected'
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60'
                    : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60'
                }`}
              >
                {dataSource === 'live' && hardwareState.esp32 === 'Connected' ? 'Live ESP32' : 'Demo Mode'}
              </span>
            </div>

            {/* Vital Signs Input / Monitor */}
            <div className="space-y-4 text-xs">
              {/* Body Temperature */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                    {t('common.bodyTemp', 'Body Temperature')} (MLX90614)
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {tempInput}°C ({((tempInput * 9) / 5 + 32).toFixed(1)}°F)
                  </span>
                </div>
                <input
                  type="range"
                  min="35.0"
                  max="41.0"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTempInput(val);
                    updateVitalsManually({ bodyTempC: val });
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>35.0°C</span>
                  <span className={tempInput > 37.5 ? 'text-rose-500 font-bold' : 'text-emerald-500'}>
                    {tempInput > 38.3 ? 'High Fever' : tempInput > 37.5 ? 'Elevated' : 'Normal (36.5–37.5°C)'}
                  </span>
                  <span>41.0°C</span>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                    {t('common.heartRate', 'Heart Rate')} (MAX30102)
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {hrInput} BPM
                  </span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="150"
                  step="1"
                  value={hrInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setHrInput(val);
                    updateVitalsManually({ heartRate: val });
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>45 BPM</span>
                  <span className={hrInput > 100 || hrInput < 60 ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                    {hrInput > 115 ? 'High Tachycardia' : hrInput > 100 ? 'Elevated' : hrInput < 60 ? 'Bradycardia' : 'Normal (60–100)'}
                  </span>
                  <span>150 BPM</span>
                </div>
              </div>

              {/* Blood Oxygen SpO2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                    {t('common.spO2', 'Blood Oxygen (SpO₂)')}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {spo2Input}%
                  </span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  step="1"
                  value={spo2Input}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSpo2Input(val);
                    updateVitalsManually({ spO2: val });
                  }}
                  className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>85%</span>
                  <span className={spo2Input < 94 ? 'text-rose-500 font-bold' : 'text-emerald-500'}>
                    {spo2Input < 90 ? 'Critical Low' : spo2Input < 95 ? 'Borderline' : 'Optimal (95–100%)'}
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Submit Screening Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:via-teal-400 dark:to-emerald-400 text-white dark:text-slate-950 font-extrabold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <span>{t('screening.analyzing', 'Analyzing patient vitals and symptoms...')}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('screening.runAnalysis', 'Analyze Patient & Run AI Health Screening')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* COMPREHENSIVE SCREENING RESULT SECTION */}
      {generatedReport && (
        <div id="screening-result-section" className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('screening.preliminaryAssessment', 'Preliminary Health Screening Assessment')}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Screening Assessment Results
              </h2>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Report #{generatedReport.reportNumber} • {new Date(generatedReport.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => generateHospitalPDFReport(generatedReport)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t('screening.downloadPDF', 'Download Hospital PDF Report')}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/patient-history')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <History className="w-4 h-4" />
                <span>{t('screening.viewInHistory', 'View in Patient History')}</span>
              </button>
            </div>
          </div>

          {/* High Risk Warning Banner (if applicable) */}
          {(generatedReport.analysis.riskLevel === 'High' || generatedReport.analysis.riskLevel === 'Critical') && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-rose-900 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-sm block text-rose-700 dark:text-rose-400">
                  {t('common.warning', 'High Risk Warning')}
                </span>
                <p className="leading-relaxed">
                  {t(
                    'screening.highRiskAlertNotice',
                    'High Risk Warning: Notable deviations detected in your vitals/symptoms. Seeking prompt medical attention is advised. This alert indicates screening values, not proof of an emergency or medical diagnosis.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Top Result Card: Risk Level, Explanation, and Meter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Preliminary Risk Assessment:
                  </span>
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      generatedReport.analysis.riskLevel === 'Low'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40'
                        : generatedReport.analysis.riskLevel === 'Moderate'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40'
                        : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40'
                    }`}
                  >
                    {generatedReport.analysis.riskLevel === 'Low'
                      ? t('common.lowRisk', 'Low Risk')
                      : generatedReport.analysis.riskLevel === 'Moderate'
                      ? t('common.moderateRisk', 'Moderate Risk')
                      : t('common.highRisk', 'High Risk')}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {generatedReport.analysis.riskExplanation || generatedReport.analysis.healthSummary}
                </p>
              </div>

              {/* Gauge Meter */}
              <div className="w-full md:w-64">
                <AIRiskMeter
                  riskLevel={generatedReport.analysis.riskLevel}
                  riskScore={generatedReport.analysis.riskScore}
                />
              </div>
            </div>

            {/* SECTION 1: WHY THIS RESULT? */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold">
                  {t('screening.whyThisResult', 'Why this result?')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Vital Signs Considered */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                    {t('screening.vitalSignsConsidered', 'Vital signs considered')}
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-400">Heart Rate:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {generatedReport.vitals.heartRate} BPM
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-400">Blood Oxygen (SpO₂):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {generatedReport.vitals.spO2}%
                      </span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-600 dark:text-slate-400">Body Temperature:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {generatedReport.vitals.bodyTempC}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Symptoms Reported */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    {t('screening.symptomsReported', 'Symptoms reported')}
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {generatedReport.patient.symptoms && generatedReport.patient.symptoms.length > 0 ? (
                      generatedReport.patient.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 font-medium text-[11px]"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 italic text-xs">
                        No acute symptoms reported
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Notable Readings */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    {t('screening.notableReadings', 'Notable readings')}
                  </span>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    {generatedReport.analysis.notableReadings && generatedReport.analysis.notableReadings.length > 0 ? (
                      generatedReport.analysis.notableReadings.map((n, idx) => (
                        <li key={idx} className="leading-snug">
                          {n}
                        </li>
                      ))
                    ) : (
                      <li>All readings remain in standard baseline boundaries.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Overall Screening Interpretation */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-cyan-950/20 border border-blue-100 dark:border-cyan-900/40 space-y-1 text-xs">
                <span className="font-bold text-blue-700 dark:text-cyan-400 block text-[11px] uppercase tracking-wider">
                  {t('screening.overallInterpretation', 'Overall screening interpretation')}
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {generatedReport.analysis.overallInterpretation || generatedReport.analysis.healthSummary}
                </p>
              </div>
            </div>

            {/* SECTION 2: RECOMMENDED NEXT STEPS */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold">
                  {t('screening.recommendedNextSteps', 'Recommended Next Steps')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Actionable General Recommendations */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Actionable General Guidance:
                  </span>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
                    {generatedReport.analysis.recommendedNextSteps &&
                    generatedReport.analysis.recommendedNextSteps.length > 0 ? (
                      generatedReport.analysis.recommendedNextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))
                    ) : (
                      <li>Continue regular monitoring and maintain healthy hydration.</li>
                    )}
                  </ul>
                </div>

                {/* When to consider consulting a healthcare professional */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400 block">
                    {t('screening.whenToConsultDoctor', 'When to consider consulting a healthcare professional:')}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {generatedReport.analysis.whenToConsultDoctor ||
                      'Consult a physician if you experience high fever above 38.5°C, persistent shortness of breath, chest pain, or if symptoms worsen over the next 24 to 48 hours.'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: MANDATORY MEDICAL DISCLAIMER */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Medical Assessment Disclaimer
                </span>
                <p className="italic font-serif leading-relaxed text-slate-800 dark:text-slate-200">
                  {t(
                    'screening.medicalDisclaimerText',
                    '“This is a preliminary health screening assessment and not a medical diagnosis. Consult a qualified healthcare professional for medical advice.”'
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Navigation / Followup Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setGeneratedReport(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('screening.performAnotherScreening', 'Perform Another Screening')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/reports')}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                >
                  {t('screening.viewAllReports', 'View All Patient Reports')}
                </button>

                <button
                  type="button"
                  onClick={() => generateHospitalPDFReport(generatedReport)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('screening.downloadPDF', 'Download Hospital PDF Report')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
