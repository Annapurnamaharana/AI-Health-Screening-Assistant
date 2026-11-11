import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  Activity,
  Clock,
  CheckCircle2,
  BellOff,
  Radio,
  X,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';

export const ActiveReminderModal: React.FC = () => {
  const {
    activeReminderAlert,
    dismissActiveReminderAlert,
    snoozeActiveReminderAlert,
    markReminderCompleted,
  } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!activeReminderAlert) return null;

  const isMedication = activeReminderAlert.type === 'medication';

  const handleMarkDone = () => {
    markReminderCompleted(activeReminderAlert.id);
  };

  const handleGoToVitals = () => {
    markReminderCompleted(activeReminderAlert.id);
    navigate('/live-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isMedication
            ? 'border-amber-400/60 dark:border-amber-500/40'
            : 'border-cyan-400/60 dark:border-cyan-500/40'
        }`}
      >
        {/* Glow effect */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            isMedication ? 'bg-amber-500/15' : 'bg-cyan-500/15'
          }`}
        />

        {/* Close / Dismiss top corner button */}
        <button
          onClick={dismissActiveReminderAlert}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Dismiss without marking done"
          aria-label="Dismiss alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with animated icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md animate-bounce ${
              isMedication
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                : 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800'
            }`}
          >
            {isMedication ? (
              <Pill className="w-6 h-6" />
            ) : (
              <Activity className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isMedication
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                }`}
              >
                {isMedication ? `💊 ${t('reminders.medication', 'Medication')}` : `🩺 ${t('reminders.vitals', 'Vital Signs')}`}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3 h-3" />
                {activeReminderAlert.time}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeReminderAlert.title}
            </h3>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 mb-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {isMedication ? t('reminders.dosage', 'Dosage & Instructions') : t('reminders.targetVitals', 'Monitoring Protocol')}
            </span>
            {activeReminderAlert.soundAlert && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <Volume2 className="w-3 h-3" />
                {t('reminders.testChime', 'Audio Alert')}
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {activeReminderAlert.dosageOrInstruction ||
              (isMedication
                ? 'Time to take your scheduled medication dose with water.'
                : 'Please sit comfortably and measure your physiological vitals.')}
          </p>

          {activeReminderAlert.targetVitals && activeReminderAlert.targetVitals.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-[10px] text-slate-400 self-center mr-1">{t('reminders.targetVitals', 'Target Vitals')}:</span>
              {activeReminderAlert.targetVitals.map((v) => (
                <span
                  key={v}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/50 dark:border-cyan-800"
                >
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Mark as Taken / Completed */}
            <button
              type="button"
              onClick={handleMarkDone}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isMedication ? t('reminders.markTaken', 'Mark as Taken') : t('reminders.markDone', 'Mark as Completed')}</span>
            </button>

            {/* Launch Telemetry for Vitals */}
            {!isMedication ? (
              <button
                type="button"
                onClick={handleGoToVitals}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>{t('nav.liveVitals', 'Open Live Vitals')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => snoozeActiveReminderAlert(10)}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>{t('reminders.snooze', 'Snooze')} (10m)</span>
              </button>
            )}
          </div>

          {/* Secondary Snooze / Dismiss bar */}
          <div className="flex items-center justify-between pt-2 text-xs">
            {!isMedication && (
              <button
                type="button"
                onClick={() => snoozeActiveReminderAlert(10)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t('reminders.snooze', 'Snooze')} 10m</span>
              </button>
            )}
            <button
              type="button"
              onClick={dismissActiveReminderAlert}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-auto flex items-center gap-1 font-medium transition-colors"
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>{t('reminders.dismiss', 'Dismiss for now')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
