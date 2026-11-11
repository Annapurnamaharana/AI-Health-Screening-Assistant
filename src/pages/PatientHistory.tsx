import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Download,
  Trash2,
  Calendar,
  FileText,
  User,
  Eye,
  X,
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ScreeningReport } from '../types';
import { generateHospitalPDFReport } from '../utils/pdfGenerator';
import { AIRiskMeter } from '../components/AIRiskMeter';

export const PatientHistory: React.FC = () => {
  const navigate = useNavigate();
  const { reports, deleteReport, addToast } = useApp();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<ScreeningReport | null>(null);

  const filteredHistory = reports.filter((r) => {
    const matchesRisk = filterRisk === 'All' || r.analysis.riskLevel === filterRisk;
    const term = searchTerm.toLowerCase().trim();
    const dateFormatted = new Date(r.createdAt).toLocaleDateString().toLowerCase();
    const matchesSearch =
      !term ||
      r.patient.name.toLowerCase().includes(term) ||
      r.reportNumber.toLowerCase().includes(term) ||
      (r.patient.id && r.patient.id.toLowerCase().includes(term)) ||
      dateFormatted.includes(term) ||
      r.createdAt.toLowerCase().includes(term);
    return matchesRisk && matchesSearch;
  });

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HealthPulse_Patient_History_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('History Exported', 'Patient database exported as JSON file.', 'success');
  };

  const exportAsCSV = () => {
    let csv = 'ReportNumber,PatientName,Age,Gender,TempC,HeartRate,SpO2,RiskLevel,HealthScore,Date,Symptoms,ShortExplanation\n';
    reports.forEach((r) => {
      const symptomsList = r.patient.symptoms ? r.patient.symptoms.join(';') : '';
      const explanation = (r.analysis.riskExplanation || r.analysis.healthSummary || '').replace(/"/g, '""');
      csv += `"${r.reportNumber}","${r.patient.name}",${r.patient.age},"${r.patient.gender}",${r.vitals.bodyTempC},${r.vitals.heartRate},${r.vitals.spO2},"${r.analysis.riskLevel}",${r.healthScore},"${r.createdAt}","${symptomsList}","${explanation}"\n`;
    });

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HealthPulse_Patient_History_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('CSV Exported', 'Patient database exported as CSV file.', 'success');
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold mb-2 shadow-xs">
            <History className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t('patientHistory.badge', 'Patient Telemetry Archive')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('nav.patientHistory', 'Patient History')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            {t(
              'patientHistory.subtitle',
              'View chronological screening records, monitor physiological vital sign measurements, inspect reasons and recommendations, and export reports.'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/health-screening')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t('nav.screening', 'New Screening')}</span>
          </button>

          <button
            type="button"
            onClick={exportAsCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={exportAsJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t(
              'common.search',
              'Search by patient name, ID, report #, or date...'
            )}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
          />
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Low', 'Moderate', 'High'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilterRisk(level)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterRisk === level
                  ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {level === 'All'
                ? 'All'
                : level === 'Low'
                ? t('common.lowRisk', 'Low Risk')
                : level === 'Moderate'
                ? t('common.moderateRisk', 'Moderate Risk')
                : t('common.highRisk', 'High Risk')}
            </button>
          ))}
        </div>
      </div>

      {/* Database Table / Records Card View */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {t('patientHistory.noHistoryFound', 'No patient screening records found.')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/health-screening')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 text-xs font-bold"
            >
              {t('screening.title', 'Start a New Screening')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Vitals (Temp / HR / SpO₂)</th>
                  <th className="p-3">Symptoms</th>
                  <th className="p-3">Risk Assessment</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredHistory.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(report)}
                  >
                    {/* Report ID */}
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {report.reportNumber}
                    </td>

                    {/* Patient Demographics */}
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {report.patient.name} ({report.patient.age}y/o {report.patient.gender})
                        </span>
                      </div>
                    </td>

                    {/* Date Recorded */}
                    <td className="p-3 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    {/* Measured Vitals */}
                    <td className="p-3 font-mono whitespace-nowrap">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{report.vitals.bodyTempC}°C</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{report.vitals.heartRate} BPM</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-blue-600 dark:text-cyan-400 font-bold">{report.vitals.spO2}%</span>
                    </td>

                    {/* Symptoms */}
                    <td className="p-3 max-w-[160px]">
                      <div className="flex flex-wrap gap-1">
                        {report.patient.symptoms && report.patient.symptoms.length > 0 ? (
                          report.patient.symptoms.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">None</span>
                        )}
                        {report.patient.symptoms && report.patient.symptoms.length > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{report.patient.symptoms.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          report.analysis.riskLevel === 'Low'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                            : report.analysis.riskLevel === 'Moderate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                        }`}
                      >
                        {report.analysis.riskLevel} Risk
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(report)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => generateHospitalPDFReport(report)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="Download Hospital PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteReport(report.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* COMPLETE DETAILS MODAL (When opening a previous screening record) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Screening Assessment Details</span>
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-cyan-400">
                  {selectedRecord.reportNumber} • {new Date(selectedRecord.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Demographics Strip */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Patient Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.patient.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Age / Gender</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRecord.patient.age}y / {selectedRecord.patient.gender}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Height / Weight</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRecord.patient.heightCm} cm / {selectedRecord.patient.weightKg} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Preliminary Risk</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedRecord.analysis.riskLevel === 'Low'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : selectedRecord.analysis.riskLevel === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  {selectedRecord.analysis.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Vitals & Reported Symptoms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Vital Sign Measurements</span>
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Body Temp:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.bodyTempC}°C ({selectedRecord.vitals.bodyTempF}°F)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Heart Rate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.heartRate} BPM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">SpO₂ Saturation:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.spO2}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Reported Symptoms</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecord.patient.symptoms && selectedRecord.patient.symptoms.length > 0 ? (
                    selectedRecord.patient.symptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-medium"
                      >
                        {sym}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None reported</span>
                  )}
                </div>
              </div>
            </div>

            {/* Why This Result? Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Why this result?</h4>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedRecord.analysis.overallInterpretation ||
                  selectedRecord.analysis.riskExplanation ||
                  selectedRecord.analysis.healthSummary}
              </p>

              {selectedRecord.analysis.notableReadings && selectedRecord.analysis.notableReadings.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 block text-[11px]">
                    Notable Readings:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {selectedRecord.analysis.notableReadings.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommended Next Steps */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Recommended Next Steps</h4>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {selectedRecord.analysis.recommendedNextSteps && selectedRecord.analysis.recommendedNextSteps.length > 0 ? (
                  selectedRecord.analysis.recommendedNextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))
                ) : (
                  <li>Continue healthy hydration and monitor vitals if symptoms persist.</li>
                )}
              </ul>
              {selectedRecord.analysis.whenToConsultDoctor && (
                <div className="pt-2 text-purple-700 dark:text-purple-300 font-medium">
                  {selectedRecord.analysis.whenToConsultDoctor}
                </div>
              )}
            </div>

            {/* Medical Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="italic text-slate-700 dark:text-slate-300 font-serif">
                “This is a preliminary health screening assessment and not a medical diagnosis. Consult a qualified healthcare professional for medical advice.”
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(null);
                  navigate('/reports');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Open in Reports Page
              </button>

              <button
                type="button"
                onClick={() => generateHospitalPDFReport(selectedRecord)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Hospital PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
