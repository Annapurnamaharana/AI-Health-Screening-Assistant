import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  Clock,
  Pill,
  Activity,
  Plus,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Edit2,
  Volume2,
  Radio,
  Calendar,
  Sparkles,
  Info,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { HealthReminder, ReminderType } from '../types';
import {
  notificationSound,
  requestBrowserNotificationPermission,
} from '../utils/notificationAudio';

export const Reminders: React.FC = () => {
  const {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderEnabled,
    markReminderCompleted,
    triggerReminderTest,
  } = useApp();
  const { t } = useLanguage();

  // Filter tab
  const [activeTab, setActiveTab] = useState<'all' | 'medication' | 'vitals' | 'today'>('all');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<ReminderType>('medication');
  const [formTitle, setFormTitle] = useState('');
  const [formDosage, setFormDosage] = useState('');
  const [formTime, setFormTime] = useState('08:00');
  const [formDays, setFormDays] = useState<string[]>(['Daily']);
  const [formTargetVitals, setFormTargetVitals] = useState<string[]>(['Heart Rate', 'SpO2']);
  const [formSoundAlert, setFormSoundAlert] = useState(true);
  const [formBrowserNotif, setFormBrowserNotif] = useState(true);

  // Notification permission
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const todayStr = new Date().toISOString().split('T')[0];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = dayNames[new Date().getDay()];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermission(res);
  };

  // Preset templates
  const presets = [
    {
      type: 'vitals' as ReminderType,
      title: t('reminders.checkYourVitalsTitle', 'Check Your Vitals'),
      dosage: t('reminders.checkYourVitalsDesc', 'Take a few minutes to check your heart rate, SpO₂, and temperature.'),
      time: '08:00',
      vitals: ['Heart Rate', 'SpO2'],
    },
    {
      type: 'medication' as ReminderType,
      title: t('reminders.medicineReminderTitle', 'Medicine Reminder'),
      dosage: t('reminders.medicineReminderDesc', 'Take your medicine at the time recommended by your doctor.'),
      time: '08:30',
      vitals: [],
    },
    {
      type: 'vitals' as ReminderType,
      title: t('reminders.drinkWaterTitle', 'Drink Water'),
      dosage: t('reminders.drinkWaterDesc', 'Remember to drink enough water throughout the day.'),
      time: '11:00',
      vitals: [],
    },
    {
      type: 'vitals' as ReminderType,
      title: t('reminders.healthCheckupTitle', 'Health Check-up'),
      dosage: t('reminders.healthCheckupDesc', 'Remember your scheduled health check-up.'),
      time: '14:00',
      vitals: [],
    },
    {
      type: 'vitals' as ReminderType,
      title: t('reminders.recheckVitalsTitle', 'Recheck Vitals'),
      dosage: t('reminders.recheckVitalsDesc', 'Check your vital signs again if you are still feeling unwell.'),
      time: '18:00',
      vitals: ['Heart Rate', 'SpO2', 'Body Temperature'],
    },
    {
      type: 'vitals' as ReminderType,
      title: t('reminders.restReminderTitle', 'Rest Reminder'),
      dosage: t('reminders.restReminderDesc', 'Take enough rest and monitor how you feel.'),
      time: '21:30',
      vitals: [],
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setFormType(preset.type);
    setFormTitle(preset.title);
    setFormDosage(preset.dosage);
    setFormTime(preset.time);
    setFormDays(['Daily']);
    setFormTargetVitals(preset.vitals.length > 0 ? preset.vitals : ['Heart Rate']);
    setEditingReminderId(null);
    setIsModalOpen(true);
  };

  // Open modal for new reminder
  const handleOpenNewModal = () => {
    setEditingReminderId(null);
    setFormType('medication');
    setFormTitle('');
    setFormDosage('');
    setFormTime('08:00');
    setFormDays(['Daily']);
    setFormTargetVitals(['Heart Rate', 'SpO2']);
    setFormSoundAlert(true);
    setFormBrowserNotif(true);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (rem: HealthReminder) => {
    setEditingReminderId(rem.id);
    setFormType(rem.type);
    setFormTitle(rem.title);
    setFormDosage(rem.dosageOrInstruction);
    setFormTime(rem.time);
    setFormDays(rem.days);
    setFormTargetVitals(rem.targetVitals || ['Heart Rate']);
    setFormSoundAlert(rem.soundAlert);
    setFormBrowserNotif(rem.browserNotification);
    setIsModalOpen(true);
  };

  // Save Reminder form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingReminderId) {
      updateReminder(editingReminderId, {
        type: formType,
        title: formTitle.trim(),
        dosageOrInstruction: formDosage.trim(),
        time: formTime,
        days: formDays.length > 0 ? formDays : ['Daily'],
        targetVitals: formType === 'vitals' ? formTargetVitals : [],
        soundAlert: formSoundAlert,
        browserNotification: formBrowserNotif,
      });
    } else {
      addReminder({
        type: formType,
        title: formTitle.trim(),
        dosageOrInstruction: formDosage.trim(),
        time: formTime,
        days: formDays.length > 0 ? formDays : ['Daily'],
        enabled: true,
        targetVitals: formType === 'vitals' ? formTargetVitals : [],
        soundAlert: formSoundAlert,
        browserNotification: formBrowserNotif,
      });
    }

    setIsModalOpen(false);
  };

  const toggleDaySelection = (day: string) => {
    if (day === 'Daily') {
      setFormDays(['Daily']);
      return;
    }
    const filtered = formDays.filter((d) => d !== 'Daily');
    if (filtered.includes(day)) {
      const next = filtered.filter((d) => d !== day);
      setFormDays(next.length === 0 ? ['Daily'] : next);
    } else {
      setFormDays([...filtered, day]);
    }
  };

  const toggleTargetVital = (vital: string) => {
    if (formTargetVitals.includes(vital)) {
      setFormTargetVitals(formTargetVitals.filter((v) => v !== vital));
    } else {
      setFormTargetVitals([...formTargetVitals, vital]);
    }
  };

  // Filtered list
  const filteredReminders = reminders.filter((rem) => {
    if (activeTab === 'medication') return rem.type === 'medication';
    if (activeTab === 'vitals') return rem.type === 'vitals';
    if (activeTab === 'today') {
      return rem.enabled && (rem.days.includes('Daily') || rem.days.includes(currentDay));
    }
    return true;
  });

  // Calculate adherence stats
  const todaysList = reminders.filter(
    (r) => r.enabled && (r.days.includes('Daily') || r.days.includes(currentDay))
  );
  const completedTodayCount = todaysList.filter((r) => r.lastCompletedDate === todayStr).length;
  const adherencePercent =
    todaysList.length > 0 ? Math.round((completedTodayCount / todaysList.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                {t('reminders.badge', 'Health Reminders')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('reminders.title', 'Health Reminders')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              {t('reminders.subtitle', 'Simple reminders to help you keep track of your daily health routine.')}
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => notificationSound.playMedicationChime()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Test the harmonic audio alert chime"
            >
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span>{t('reminders.testChime', 'Test Audio Chime')}</span>
            </button>

            {permission !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-800 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('reminders.enableDesktop', 'Enable Desktop Notifications')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenNewModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('reminders.addReminder', 'Add Reminder')}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('reminders.todaySchedule', "Today's Adherence")}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {completedTodayCount}/{todaysList.length}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ({adherencePercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('reminders.medication', 'Medications')}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
                {reminders.filter((r) => r.type === 'medication').length} {t('common.active', 'Active')}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('reminders.vitals', 'Vital Signs')}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
                {reminders.filter((r) => r.type === 'vitals').length} {t('common.active', 'Active')}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('reminders.time', 'Next Scheduled')}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                {todaysList.find((r) => r.lastCompletedDate !== todayStr)?.time || t('common.done', 'All Done Today')}
              </span>
            </div>
          </div>
        </div>

        {/* Quick-Add Presets Carousel */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t('reminders.quickTemplates', 'Routine Templates')}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">{t('reminders.templateHint', 'Click any template to prefill and schedule')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presets.map((preset, idx) => {
              const isMed = preset.type === 'medication';
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500 text-left transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isMed
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400'
                    }`}
                  >
                    {isMed ? <Pill className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shrink-0">
                        {preset.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {preset.dosage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t('reminders.allRoutines', 'All Routines')} ({reminders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('medication')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'medication'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>{t('reminders.medication', 'Medications')} ({reminders.filter((r) => r.type === 'medication').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vitals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'vitals'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t('reminders.vitals', 'Vitals Monitoring')} ({reminders.filter((r) => r.type === 'vitals').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('reminders.todaySchedule', "Today's Schedule")} ({todaysList.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>{t('reminders.realTimeSchedulerActive', 'Real-time background scheduler active')}</span>
          </span>
        </div>

        {/* Reminders List */}
        <div className="space-y-3.5">
          {filteredReminders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t('reminders.noReminders', 'No reminders found in this view')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {t('reminders.noRemindersPrompt', 'Create a customized reminder or click one of the quick templates above to begin tracking your medication and vitals routines.')}
              </p>
              <button
                type="button"
                onClick={handleOpenNewModal}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('reminders.createReminderBtn', 'Create New Reminder')}</span>
              </button>
            </div>
          ) : (
            filteredReminders.map((rem) => {
              const isMed = rem.type === 'medication';
              const isCompletedToday = rem.lastCompletedDate === todayStr;

              return (
                <div
                  key={rem.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    !rem.enabled
                      ? 'opacity-60 border-slate-200 dark:border-slate-800'
                      : isCompletedToday
                      ? 'border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/15 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Left: Indicator, Title, Dosage, Vitals, Days */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Completion Status Toggle Button */}
                    <button
                      type="button"
                      onClick={() => markReminderCompleted(rem.id)}
                      className="mt-1 shrink-0 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                      title={
                        isCompletedToday
                          ? 'Completed for today (Click to re-mark)'
                          : 'Click to mark as completed'
                      }
                      aria-label="Toggle completion status"
                    >
                      {isCompletedToday ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isMed
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                          }`}
                        >
                          {isMed ? <Pill className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                          <span>{isMed ? t('reminders.medication', 'Medication') : t('reminders.vitals', 'Vital Signs')}</span>
                        </span>

                        {/* Title */}
                        <h3
                          className={`text-base font-extrabold ${
                            isCompletedToday
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {rem.title}
                        </h3>

                        {isCompletedToday && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {t('reminders.completedToday', 'Completed Today')}
                          </span>
                        )}
                      </div>

                      {/* Dosage or instructions */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {rem.dosageOrInstruction}
                      </p>

                      {/* Meta chips: Time, Frequency, Vitals */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{rem.time}</span>
                        </span>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {rem.days.includes('Daily') ? t('reminders.daily', 'Every Day') : rem.days.join(', ')}
                        </span>

                        {rem.targetVitals && rem.targetVitals.length > 0 && (
                          <div className="flex items-center gap-1">
                            {rem.targetVitals.map((v) => (
                              <span
                                key={v}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/50 dark:border-blue-900"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}

                        {rem.soundAlert && (
                          <span
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"
                            title="Audible chime enabled"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{t('reminders.testChime', 'Audio')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                    {/* Live link if vitals */}
                    {!isMed && (
                      <NavLink
                        to="/live-dashboard"
                        className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800 transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Open ESP32 Live Telemetry"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('nav.liveVitals', 'Stream Vitals')}</span>
                      </NavLink>
                    )}

                    {/* Test Alarm Button */}
                    <button
                      type="button"
                      onClick={() => triggerReminderTest(rem.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Test alarm alert & audio"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('common.test', 'Test Alert')}</span>
                    </button>

                    {/* Enable/Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleReminderEnabled(rem.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        rem.enabled
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {rem.enabled ? t('common.active', 'Active') : t('common.paused', 'Paused')}
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(rem)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit reminder"
                      aria-label="Edit reminder"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => deleteReminder(rem.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete reminder"
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Reminder Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-cyan-950 text-blue-600 dark:text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {editingReminderId ? t('reminders.modalTitleEdit', 'Edit Health Reminder') : t('reminders.modalTitleNew', 'Create Health Reminder')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('reminders.modalSubtitle', 'Simple reminders to help you keep track of your daily health routine.')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('reminders.type', 'Reminder Category')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('medication')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formType === 'medication'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Pill className="w-4 h-4" />
                    <span>{t('reminders.medication', 'Medication Intake')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('vitals')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formType === 'vitals'
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 shadow-xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>{t('reminders.vitals', 'Vital Signs Telemetry')}</span>
                  </button>
                </div>
              </div>

              {/* Title / Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {formType === 'medication' ? t('reminders.medicationName', 'Medication Name & Strength') : t('reminders.vitalsName', 'Vital Signs Check Name')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formType === 'medication'
                      ? 'e.g., Amlodipine 5mg or Metformin'
                      : 'e.g., Morning Blood Pressure & Pulse Baseline'
                  }
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Dosage / Instructions */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {formType === 'medication'
                    ? t('reminders.dosage', 'Dosage & Special Instructions')
                    : t('reminders.targetVitals', 'Clinical Instructions & Hardware Guidance')}
                </label>
                <input
                  type="text"
                  placeholder={
                    formType === 'medication'
                      ? 'e.g., Take 1 tablet with a full glass of water after breakfast'
                      : 'e.g., Rest 2 mins, attach MAX30102 sensor to index finger'
                  }
                  value={formDosage}
                  onChange={(e) => setFormDosage(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t('reminders.time', 'Scheduled Time (Daily Alarm)')}
                </label>
                <input
                  type="time"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Days selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('reminders.frequency', 'Recurring Frequency')}
                  </label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFormDays(['Daily'])}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        formDays.includes('Daily')
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t('reminders.daily', 'Every Day')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      Weekdays
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected = formDays.includes('Daily') || formDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 border border-blue-300 dark:border-cyan-800'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target vitals (if vitals type) */}
              {formType === 'vitals' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {t('reminders.targetVitals', 'Target Vital Parameters')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Heart Rate', 'SpO2', 'Body Temperature'].map((v) => {
                      const isChecked = formTargetVitals.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => toggleTargetVital(v)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                          }`}
                        >
                          <span>{v}</span>
                          {isChecked && <Check className="w-3 h-3 text-cyan-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alert preferences */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                    {t('reminders.playAudioChime', 'Play audible chime alert when scheduled')}
                  </span>
                  <input
                    type="checkbox"
                    checked={formSoundAlert}
                    onChange={(e) => setFormSoundAlert(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-500" />
                    {t('reminders.triggerBrowserNotif', 'Trigger native browser desktop notification')}
                  </span>
                  <input
                    type="checkbox"
                    checked={formBrowserNotif}
                    onChange={(e) => setFormBrowserNotif(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingReminderId ? t('reminders.saveChanges', 'Save Changes') : t('reminders.saveReminder', 'Save Reminder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
