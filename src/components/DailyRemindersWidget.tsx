import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  Pill,
  Activity,
  ArrowRight,
  Radio,
  Plus,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { notificationSound } from '../utils/notificationAudio';

export const DailyRemindersWidget: React.FC = () => {
  const { reminders, markReminderCompleted, triggerReminderTest } = useApp();
  const { t } = useLanguage();

  const todayStr = new Date().toISOString().split('T')[0];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = dayNames[new Date().getDay()];

  // Today's scheduled routines
  const todaysList = reminders.filter(
    (r) => r.enabled && (r.days.includes('Daily') || r.days.includes(currentDay))
  );

  const completedCount = todaysList.filter((r) => r.lastCompletedDate === todayStr).length;
  const progressPercent =
    todaysList.length > 0 ? Math.round((completedCount / todaysList.length) * 100) : 100;

  return (
    <div
      id="daily-reminders-widget"
      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 dark:bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-cyan-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('reminders.title', 'Health Reminders')}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800">
                {completedCount}/{todaysList.length} {t('common.done', 'Done')} ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('reminders.subtitle', 'Simple reminders to help you keep track of your daily health routine.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => notificationSound.playMedicationChime()}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Test alert chime"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">{t('reminders.testChime', 'Chime')}</span>
          </button>

          <NavLink
            to="/reminders"
            className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-cyan-500/10 hover:bg-blue-100 dark:hover:bg-cyan-500/20 border border-blue-200 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('reminders.allRoutines', 'Manage All')}</span>
          </NavLink>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Today's Checklist */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {todaysList.length === 0 ? (
          <div className="col-span-2 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('reminders.noReminders', 'No routines scheduled for today. Click "Manage All" to add medication or vitals checks.')}
          </div>
        ) : (
          todaysList.map((rem) => {
            const isCompleted = rem.lastCompletedDate === todayStr;
            const isMed = rem.type === 'medication';

            return (
              <div
                key={rem.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/60 opacity-75'
                    : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-cyan-500/50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => markReminderCompleted(rem.id)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                    title={isCompleted ? 'Marked complete for today' : 'Click to mark as done'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                          isMed
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                        }`}
                      >
                        {isMed ? t('reminders.medication', 'Medication') : t('reminders.vitals', 'Vitals')}
                      </span>
                      <h4
                        className={`text-xs font-bold truncate ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {rem.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {rem.dosageOrInstruction}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {rem.time}
                      </span>
                      {rem.targetVitals && rem.targetVitals.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rem.targetVitals.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => triggerReminderTest(rem.id)}
                    className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
                    title="Simulate alarm"
                  >
                    {t('common.test', 'Test')}
                  </button>

                  {!isMed && (
                    <NavLink
                      to="/live-dashboard"
                      className="p-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 transition-colors"
                      title="Measure with ESP32"
                    >
                      <Radio className="w-3.5 h-3.5" />
                    </NavLink>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {t('reminders.realTimeSchedulerActive', 'Chimes play automatically when tab is open')}
        </span>
        <NavLink
          to="/reminders"
          className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
        >
          <span>{t('reminders.viewSchedule', 'View full reminder schedule')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>
    </div>
  );
};
