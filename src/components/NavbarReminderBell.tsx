import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  Pill,
  Activity,
  ArrowRight,
  Volume2,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  notificationSound,
  requestBrowserNotificationPermission,
} from '../utils/notificationAudio';

export const NavbarReminderBell: React.FC = () => {
  const { reminders, markReminderCompleted, triggerReminderTest } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [permState, setPermState] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check today's date string
  const todayStr = new Date().toISOString().split('T')[0];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = dayNames[new Date().getDay()];

  // Today's active reminders
  const todaysReminders = reminders.filter(
    (r) => r.enabled && (r.days.includes('Daily') || r.days.includes(currentDay))
  );

  const pendingCount = todaysReminders.filter((r) => r.lastCompletedDate !== todayStr).length;
  const completedCount = todaysReminders.filter((r) => r.lastCompletedDate === todayStr).length;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermState(Notification.permission);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleEnableDesktop = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermState(res);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
        title="Daily Health & Medication Reminders"
        aria-label="View Health Reminders"
      >
        <Bell className="w-4 h-4" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Daily Reminders
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800 font-semibold">
                  {completedCount}/{todaysReminders.length} Done
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {pendingCount === 0
                  ? 'All scheduled routines completed today!'
                  : `${pendingCount} routine${pendingCount > 1 ? 's' : ''} pending for today`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                notificationSound.playMedicationChime();
              }}
              className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              title="Test audio chime"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop notification banner if default */}
          {permState === 'default' && (
            <div className="p-2.5 bg-blue-50/80 dark:bg-cyan-950/40 border-b border-blue-100 dark:border-cyan-900/60 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-blue-900 dark:text-cyan-200">
                Enable desktop sound alerts?
              </span>
              <button
                type="button"
                onClick={handleEnableDesktop}
                className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 transition-colors"
              >
                Allow Alerts
              </button>
            </div>
          )}

          {/* List of today's reminders */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {todaysReminders.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No reminders scheduled for today.
              </div>
            ) : (
              todaysReminders.map((rem) => {
                const isCompleted = rem.lastCompletedDate === todayStr;
                return (
                  <div
                    key={rem.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors ${
                      isCompleted
                        ? 'bg-slate-50/50 dark:bg-slate-950/30 opacity-70'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => markReminderCompleted(rem.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                      title={isCompleted ? 'Completed today' : 'Click to mark as done'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold truncate ${
                            isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {rem.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {rem.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {rem.dosageOrInstruction}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerReminderTest(rem.id)}
                      className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline shrink-0 self-center"
                      title="Test alarm alert"
                    >
                      Test
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <NavLink
              to="/reminders"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All Reminders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>

            <NavLink
              to="/reminders"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};
