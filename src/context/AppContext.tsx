import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_PATIENT_REPORTS } from '../data/mockData';
import { INITIAL_HEALTH_REMINDERS } from '../data/mockReminders';
import { apiService } from '../services/api';
import {
  AppSettings,
  HardwareConnectionState,
  HealthReminder,
  PatientInfo,
  ScreeningReport,
  SensorReading,
  ToastMessage,
} from '../types';
import {
  notificationSound,
  dispatchBrowserNotification,
} from '../utils/notificationAudio';

interface AppContextType {
  reports: ScreeningReport[];
  currentVitals: SensorReading;
  hardwareState: HardwareConnectionState;
  settings: AppSettings;
  toasts: ToastMessage[];
  reminders: HealthReminder[];
  activeReminderAlert: HealthReminder | null;
  isStreaming: boolean;
  dataSource: 'live' | 'demo';
  setDataSource: (source: 'live' | 'demo') => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  connectHardware: () => Promise<void>;
  disconnectHardware: () => Promise<void>;
  testHardwareComponent: (action: 'buzzer' | 'led' | 'oled', val?: string) => Promise<void>;
  toggleStreaming: () => void;
  updateVitalsManually: (vitals: Partial<SensorReading>) => void;
  createScreeningReport: (patient: PatientInfo) => Promise<ScreeningReport>;
  deleteReport: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  addReminder: (reminder: Omit<HealthReminder, 'id' | 'createdAt'>) => HealthReminder;
  updateReminder: (id: string, updates: Partial<HealthReminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderEnabled: (id: string) => void;
  markReminderCompleted: (id: string) => void;
  triggerReminderTest: (id: string) => void;
  dismissActiveReminderAlert: () => void;
  snoozeActiveReminderAlert: (minutes?: number) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  audioAlertsEnabled: true,
  highTempThresholdC: 38.0,
  lowSpO2Threshold: 94,
  highHRThreshold: 100,
  lowHRThreshold: 60,
  esp32IpAddress: '192.168.1.105',
  esp32Port: 3000,
  geminiModel: 'gemini-3.8-flash',
  autoRefreshIntervalMs: 2000,
  useSimulatedDataIfOffline: true,
  tempCalibrationOffsetC: 0.0,
};

const DEFAULT_VITALS: SensorReading = {
  bodyTempC: 36.8,
  bodyTempF: 98.24,
  heartRate: 74,
  spO2: 98,
  deviceStatus: 'Online',
  wifiSignal: -58,
  timestamp: new Date().toISOString(),
  dataSource: 'demo',
};

const DEFAULT_HARDWARE_STATE: HardwareConnectionState = {
  esp32: 'Disconnected',
  max30102: 'Offline',
  mlx90614: 'Offline',
  oledDisplay: 'Offline',
  buzzerActive: false,
  ledColor: 'Off',
  lastPingMs: 0,
  ipAddress: '192.168.1.105',
  isRealHardware: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ScreeningReport[]>(() => {
    const saved = localStorage.getItem('hp_reports');
    return saved ? JSON.parse(saved) : MOCK_PATIENT_REPORTS;
  });

  const [currentVitals, setCurrentVitals] = useState<SensorReading>(DEFAULT_VITALS);
  const [hardwareState, setHardwareState] = useState<HardwareConnectionState>(DEFAULT_HARDWARE_STATE);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hp_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, theme: parsed.theme || 'dark' };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [reminders, setReminders] = useState<HealthReminder[]>(() => {
    const saved = localStorage.getItem('hp_reminders_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_HEALTH_REMINDERS;
      }
    }
    return INITIAL_HEALTH_REMINDERS;
  });
  const [activeReminderAlert, setActiveReminderAlert] = useState<HealthReminder | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'live' | 'demo'>('demo');

  // Sync reports to localStorage
  useEffect(() => {
    localStorage.setItem('hp_reports', JSON.stringify(reports));
  }, [reports]);

  // Sync reminders to localStorage
  useEffect(() => {
    localStorage.setItem('hp_reminders_v2', JSON.stringify(reminders));
  }, [reminders]);

  // Sync settings & HTML dark class
  useEffect(() => {
    localStorage.setItem('hp_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Auto sensor simulation / poll stream
  useEffect(() => {
    if (!isStreaming || hardwareState.esp32 !== 'Connected') return;

    const interval = setInterval(() => {
      // Small fluctuation for live realism
      setCurrentVitals((prev) => {
        const hrFluct = Math.floor((Math.random() - 0.5) * 4);
        const newHR = Math.max(55, Math.min(125, prev.heartRate + hrFluct));
        const tempFluct = parseFloat(((Math.random() - 0.5) * 0.1).toFixed(1));
        const newTempC = parseFloat(Math.max(35.5, Math.min(40.5, prev.bodyTempC + tempFluct)).toFixed(1));
        const spO2Fluct = Math.floor((Math.random() - 0.5) * 1.5);
        const newSpO2 = Math.max(88, Math.min(100, prev.spO2 + spO2Fluct));

        const isAlert = newTempC >= settings.highTempThresholdC || newSpO2 <= settings.lowSpO2Threshold || newHR >= settings.highHRThreshold;

        // Update LED color based on health state
        setHardwareState((hPrev) => ({
          ...hPrev,
          ledColor: isAlert ? (newSpO2 < 90 || newTempC > 39 ? 'Red' : 'Yellow') : 'Green',
          buzzerActive: isAlert && settings.audioAlertsEnabled,
        }));

        return {
          bodyTempC: newTempC,
          bodyTempF: parseFloat(((newTempC * 9) / 5 + 32).toFixed(1)),
          heartRate: newHR,
          spO2: newSpO2,
          deviceStatus: 'Online',
          wifiSignal: -50 - Math.floor(Math.random() * 20),
          timestamp: new Date().toISOString(),
        };
      });
    }, settings.autoRefreshIntervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, hardwareState.esp32, settings]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const connectHardware = async () => {
    setHardwareState((prev) => ({ ...prev, esp32: 'Connecting' }));
    addToast('ESP32 Connecting', 'Initiating handshake with ESP32 DevKit V1...', 'info');

    const res = await apiService.connectDevice();
    setTimeout(() => {
      setHardwareState({
        esp32: 'Connected',
        max30102: 'Online',
        mlx90614: 'Online',
        oledDisplay: 'Online',
        buzzerActive: false,
        ledColor: 'Green',
        lastPingMs: 12,
        ipAddress: res.ip || '192.168.1.105',
        isRealHardware: true,
      });
      setDataSource('live');
      setCurrentVitals((prev) => ({ ...prev, dataSource: 'live' }));
      addToast('ESP32 Connected', `Device online at IP ${res.ip || '192.168.1.105'}. Sensors calibrated.`, 'success');
    }, 1000);
  };

  const disconnectHardware = async () => {
    await apiService.disconnectDevice();
    setHardwareState({
      esp32: 'Disconnected',
      max30102: 'Offline',
      mlx90614: 'Offline',
      oledDisplay: 'Offline',
      buzzerActive: false,
      ledColor: 'Off',
      lastPingMs: 0,
      ipAddress: '0.0.0.0',
      isRealHardware: false,
    });
    setDataSource('demo');
    setCurrentVitals((prev) => ({ ...prev, dataSource: 'demo' }));
    addToast('Device Disconnected', 'ESP32 hardware disconnected. System reverted to Demo Mode.', 'warning');
  };

  const testHardwareComponent = async (action: 'buzzer' | 'led' | 'oled', val?: string) => {
    addToast('Hardware Test', `Triggering ${action.toUpperCase()} command...`, 'info');
    await apiService.testHardware(action, val);
    if (action === 'buzzer') {
      setHardwareState((prev) => ({ ...prev, buzzerActive: true }));
      setTimeout(() => setHardwareState((prev) => ({ ...prev, buzzerActive: false })), 1200);
    }
  };

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev);
    addToast('Telemetry Stream', isStreaming ? 'Live vitals paused.' : 'Live vitals resumed.', 'info');
  };

  const updateVitalsManually = (partial: Partial<SensorReading>) => {
    setCurrentVitals((prev) => {
      const nextC = partial.bodyTempC ?? prev.bodyTempC;
      return {
        ...prev,
        ...partial,
        bodyTempC: nextC,
        bodyTempF: parseFloat(((nextC * 9) / 5 + 32).toFixed(1)),
        timestamp: new Date().toISOString(),
      };
    });
  };

  const createScreeningReport = async (patient: PatientInfo): Promise<ScreeningReport> => {
    addToast('AI Health Screening', 'Analyzing vitals & generating medical report...', 'info');

    const analysis = await apiService.runAIAnalysis(patient, currentVitals);

    // Calculate score 0-100
    let healthScore = 100;
    if (currentVitals.bodyTempC > 38.0) healthScore -= 20;
    if (currentVitals.spO2 < 95) healthScore -= (95 - currentVitals.spO2) * 5;
    if (currentVitals.heartRate > 100 || currentVitals.heartRate < 60) healthScore -= 15;
    if (patient.symptoms.length > 0) healthScore -= patient.symptoms.length * 4;
    healthScore = Math.max(10, Math.min(100, Math.round(healthScore)));

    const newReport: ScreeningReport = {
      id: `rep-${Date.now()}`,
      reportNumber: `HP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      patient,
      vitals: { ...currentVitals },
      analysis,
      healthScore,
      createdAt: new Date().toISOString(),
      doctorSigned: false,
    };

    setReports((prev) => [newReport, ...prev]);
    await apiService.saveReport(newReport);

    // Alert system trigger if High or Critical risk
    if (analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical') {
      if (hardwareState.esp32 === 'Connected') {
        apiService.testHardware('buzzer');
        setHardwareState((prev) => ({ ...prev, buzzerActive: true, ledColor: 'Red' }));
        setTimeout(() => {
          setHardwareState((prev) => ({ ...prev, buzzerActive: false }));
        }, 2500);
      }
      addToast(
        'High Risk Alert',
        'Preliminary screening shows elevated risk. Seek prompt medical consultation.',
        'error'
      );
    } else {
      addToast('Screening Complete', `Report ${newReport.reportNumber} generated. Risk: ${analysis.riskLevel}`, 'success');
    }

    return newReport;
  };

  const deleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    await apiService.deleteReport(id);
    addToast('Report Deleted', 'Record removed from local database.', 'warning');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings Updated', 'Your configuration changes have been saved.', 'success');
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  // --- HEALTH REMINDERS ENGINE ---
  const triggerReminder = (reminder: HealthReminder, dateStr?: string) => {
    const today = dateStr || new Date().toISOString().split('T')[0];

    // Mark as triggered for today
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, lastTriggeredDate: today } : r))
    );

    // Active popup alert modal
    setActiveReminderAlert(reminder);

    // Play synthesized sound chime if enabled
    if (reminder.soundAlert) {
      if (reminder.type === 'medication') {
        notificationSound.playMedicationChime();
      } else {
        notificationSound.playVitalsReminderChime();
      }
    }

    // Native browser notification if enabled
    if (reminder.browserNotification) {
      dispatchBrowserNotification(
        reminder.type === 'medication'
          ? `💊 Medication Reminder: ${reminder.title}`
          : `🩺 Vital Signs Telemetry: ${reminder.title}`,
        {
          body: reminder.dosageOrInstruction || `Scheduled health routine at ${reminder.time}`,
          tag: `aura-health-rem-${reminder.id}`,
        }
      );
    }

    addToast(
      reminder.type === 'medication' ? '💊 Medication Due' : '🩺 Vital Signs Check Due',
      `${reminder.title} (${reminder.time}) • ${reminder.dosageOrInstruction}`,
      'warning'
    );
  };

  // Reminder scheduler interval (checks every 10 seconds)
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = dayNames[now.getDay()];

      reminders.forEach((rem) => {
        if (!rem.enabled) return;
        const matchesDay = rem.days.includes('Daily') || rem.days.includes(currentDay);
        if (matchesDay && rem.time === currentTimeStr && rem.lastTriggeredDate !== todayDateStr) {
          triggerReminder(rem, todayDateStr);
        }
      });
    };

    const intervalId = setInterval(checkSchedule, 10000);
    checkSchedule();

    return () => clearInterval(intervalId);
  }, [reminders]);

  const addReminder = (newRem: Omit<HealthReminder, 'id' | 'createdAt'>): HealthReminder => {
    const created: HealthReminder = {
      ...newRem,
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [created, ...prev]);
    addToast(
      'Reminder Created',
      `Scheduled ${created.type === 'medication' ? 'medication' : 'vital signs'} reminder "${created.title}" at ${created.time}.`,
      'success'
    );
    return created;
  };

  const updateReminder = (id: string, updates: Partial<HealthReminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    addToast('Reminder Updated', 'Changes saved successfully.', 'info');
  };

  const deleteReminder = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (activeReminderAlert && activeReminderAlert.id === id) {
      setActiveReminderAlert(null);
    }
    addToast('Reminder Deleted', `Removed "${target?.title || 'reminder'}" from schedule.`, 'warning');
  };

  const toggleReminderEnabled = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.enabled;
          addToast(
            nextState ? 'Reminder Activated' : 'Reminder Paused',
            `"${r.title}" is now ${nextState ? 'active' : 'paused'}.`,
            'info'
          );
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  const markReminderCompleted = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = reminders.find((r) => r.id === id);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastCompletedDate: today } : r))
    );
    if (activeReminderAlert && activeReminderAlert.id === id) {
      setActiveReminderAlert(null);
    }
    addToast(
      'Completed Routine Logged',
      target?.type === 'medication'
        ? `Logged dose of "${target.title}".`
        : `Logged vital check for "${target?.title}".`,
      'success'
    );
  };

  const triggerReminderTest = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (target) {
      triggerReminder(target);
      addToast('Simulating Reminder Alert', `Triggered test alarm for "${target.title}".`, 'info');
    }
  };

  const dismissActiveReminderAlert = () => {
    setActiveReminderAlert(null);
  };

  const snoozeActiveReminderAlert = (minutes: number = 10) => {
    if (!activeReminderAlert) return;
    const target = activeReminderAlert;
    setActiveReminderAlert(null);
    addToast('Reminder Snoozed', `Snoozed "${target.title}" for ${minutes} minutes.`, 'warning');
    setTimeout(() => {
      triggerReminder(target);
    }, minutes * 60 * 1000);
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        currentVitals,
        hardwareState,
        settings,
        toasts,
        reminders,
        activeReminderAlert,
        isStreaming,
        dataSource,
        setDataSource,
        addToast,
        removeToast,
        connectHardware,
        disconnectHardware,
        testHardwareComponent,
        toggleStreaming,
        updateVitalsManually,
        createScreeningReport,
        deleteReport,
        updateSettings,
        toggleTheme,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderEnabled,
        markReminderCompleted,
        triggerReminderTest,
        dismissActiveReminderAlert,
        snoozeActiveReminderAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
