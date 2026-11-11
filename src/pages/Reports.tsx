import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Search,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  Stethoscope,
  X,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ScreeningReport } from '../types';
import { generateHospitalPDFReport } from '../utils/pdfGenerator';
import { AIRiskMeter } from '../components/AIRiskMeter';

export const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reports, deleteReport } = useApp();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewReport, setViewReport] = useState<ScreeningReport | null>(null);

  // Check if a specific report was requested via URL query params (?id=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetId = params.get('id') || params.get('report');
    if (targetId) {
      const found = reports.find(
        (r) => r.id === targetId || r.reportNumber.toLowerCase() === targetId.toLowerCase()
      );
      if (found) {
        setViewReport(found);
      }
    }
  }, [location.search, reports]);

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      r.reportNumber.toLowerCase().includes(term) ||
      r.patient.name.toLowerCase().includes(term) ||
      (r.patient.id && r.patient.id.toLowerCase().includes(term)) ||
      r.createdAt.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold mb-2 shadow-xs">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t('reports.badge', 'Patient Diagnostic Records')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('nav.reports', 'Patient Screening Reports')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            {t(
              'reports.subtitle',
              'Inspect generated AI health screening dossiers, review vital signs and clinical interpretations, and export standardized hospital PDF reports.'
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t(
              'reports.filterPlaceholder',
              'Filter by patient name or report ID...'
            )}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* Reports List Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {t('reports.noReportsFound', 'No screening reports found matching your search.')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/health-screening')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 text-xs font-bold"
          >
            {t('screening.title', 'Generate New Patient Screening')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-blue-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 block">
                      {report.reportNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{report.patient.name}</span>
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      report.analysis.riskLevel === 'Low'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                        : report.analysis.riskLevel === 'Moderate'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                    }`}
                  >
                    {report.analysis.riskLevel} Risk
                  </span>
                </div>

                {/* Vitals Snapshot Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                      {t('common.bodyTemp', 'Temp')}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {report.vitals.bodyTempC}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                      {t('common.heartRate', 'Heart Rate')}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {report.vitals.heartRate} BPM
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                      {t('common.spO2', 'SpO₂')}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {report.vitals.spO2}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {report.analysis.overallInterpretation ||
                    report.analysis.riskExplanation ||
                    report.analysis.healthSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewReport(report)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>{t('common.viewDetails', 'View Details')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateHospitalPDFReport(report)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReport(report.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL REPORT VIEWER MODAL */}
      {viewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
            {/* Header: AI Health Screening Assistant */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 text-xs font-semibold mb-1">
                  <Stethoscope className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>AI Health Screening Assistant</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Patient Health Screening Report
                </h3>
                <span className="text-xs font-mono text-blue-600 dark:text-cyan-400">
                  {viewReport.reportNumber} • {new Date(viewReport.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewReport(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Patient Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                Patient Information
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewReport.patient.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Age / Gender</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {viewReport.patient.age} yrs / {viewReport.patient.gender}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Height / Weight</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {viewReport.patient.heightCm} cm / {viewReport.patient.weightKg} kg
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Patient ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{viewReport.patient.id}</span>
                </div>
              </div>
            </div>

            {/* 2. Vital Measurements & Reported Symptoms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block uppercase text-[10px] tracking-wider text-slate-500">
                  Vital Measurements
                </span>
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-1">
                    <span className="text-slate-600 dark:text-slate-400">Body Temp:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {viewReport.vitals.bodyTempC}°C ({viewReport.vitals.bodyTempF}°F)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-1">
                    <span className="text-slate-600 dark:text-slate-400">Heart Rate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {viewReport.vitals.heartRate} BPM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">SpO₂:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {viewReport.vitals.spO2}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block uppercase text-[10px] tracking-wider text-slate-500">
                  Reported Symptoms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewReport.patient.symptoms && viewReport.patient.symptoms.length > 0 ? (
                    viewReport.patient.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None reported</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Preliminary Risk Level */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Preliminary Risk Level:
                </span>
                <span
                  className={`text-sm font-extrabold px-3 py-1 rounded-full border inline-block mt-1 ${
                    viewReport.analysis.riskLevel === 'Low'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : viewReport.analysis.riskLevel === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400'
                      : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  {viewReport.analysis.riskLevel} Risk
                </span>
              </div>
              <div className="w-52">
                <AIRiskMeter
                  riskLevel={viewReport.analysis.riskLevel}
                  riskScore={viewReport.analysis.riskScore}
                />
              </div>
            </div>

            {/* 4. Why This Result? */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Why This Result?</h4>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {viewReport.analysis.overallInterpretation ||
                  viewReport.analysis.riskExplanation ||
                  viewReport.analysis.healthSummary}
              </p>

              {viewReport.analysis.notableReadings && viewReport.analysis.notableReadings.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 block text-[11px]">
                    Notable Observations:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {viewReport.analysis.notableReadings.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 5. Recommended Next Steps */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Recommended Next Steps</h4>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {viewReport.analysis.recommendedNextSteps && viewReport.analysis.recommendedNextSteps.length > 0 ? (
                  viewReport.analysis.recommendedNextSteps.map((step, idx) => (
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
              {viewReport.analysis.whenToConsultDoctor && (
                <div className="pt-2 text-purple-700 dark:text-purple-300 font-medium">
                  {viewReport.analysis.whenToConsultDoctor}
                </div>
              )}
            </div>

            {/* 6. Medical Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="italic text-slate-700 dark:text-slate-300 font-serif">
                “This is a preliminary health screening assessment and not a medical diagnosis. Consult a qualified healthcare professional for medical advice.”
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => generateHospitalPDFReport(viewReport)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Hospital PDF Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
