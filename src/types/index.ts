export type Gender = 'Male' | 'Female' | 'Other';

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  symptoms: string[];
  existingDiseases: string[];
  notes?: string;
  timestamp: string;
}

export interface SensorReading {
  bodyTempC: number;
  bodyTempF: number;
  heartRate: number; // BPM
  spO2: number; // Percentage
  deviceStatus: 'Online' | 'Offline' | 'Calibrating' | 'Error';
  wifiSignal: number; // dBm e.g. -65
  timestamp: string;
  dataSource?: 'live' | 'demo';
}

export interface HardwareModule {
  name: string;
  model: string;
  type: 'MCU' | 'Sensor' | 'Display' | 'Output' | 'Input';
  status: 'Connected' | 'Disconnected' | 'Testing' | 'Fault';
  pins: string;
  description: string;
}

export interface HardwareConnectionState {
  esp32: 'Connected' | 'Disconnected' | 'Connecting';
  max30102: 'Online' | 'Offline' | 'Error';
  mlx90614: 'Online' | 'Offline' | 'Error';
  oledDisplay: 'Online' | 'Offline' | 'Error';
  buzzerActive: boolean;
  ledColor: 'Green' | 'Yellow' | 'Red' | 'Off';
  lastPingMs: number;
  ipAddress: string;
  isRealHardware?: boolean;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface VitalSignObservation {
  name: string;
  value: string;
  status: 'Normal' | 'Elevated' | 'Low' | 'High';
  interpretation: string;
}

export interface AIAnalysisResult {
  healthSummary: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  riskExplanation?: string;
  vitalSignsConsidered?: VitalSignObservation[];
  symptomsReported?: string[];
  notableReadings?: string[];
  overallInterpretation?: string;
  recommendedNextSteps?: string[];
  whenToConsultDoctor?: string;
  disclaimer: string;
  aiDiagnosisSuggestions: string[];
  lifestyleAdvice: string[];
  dietAdvice: string[];
  hydrationAdvice: string;
  sleepRecommendation: string;
  exerciseRecommendation: string;
  doctorConsultationRequired: boolean;
  doctorConsultationReason?: string;
}

export interface ScreeningReport {
  id: string;
  reportNumber: string;
  patient: PatientInfo;
  vitals: SensorReading;
  analysis: AIAnalysisResult;
  healthScore: number; // 0-100
  createdAt: string;
  doctorSigned?: boolean;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  category: 'Cardiovascular' | 'Respiratory' | 'Metabolic' | 'Infectious' | 'Environmental' | 'General';
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatmentOverview: string;
  vitalsWarning: {
    tempMax?: number;
    tempMin?: number;
    hrMax?: number;
    hrMin?: number;
    spO2Min?: number;
  };
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  audioAlertsEnabled: boolean;
  highTempThresholdC: number;
  lowSpO2Threshold: number;
  highHRThreshold: number;
  lowHRThreshold: number;
  esp32IpAddress: string;
  esp32Port: number;
  geminiModel: string;
  autoRefreshIntervalMs: number;
  useSimulatedDataIfOffline: boolean;
  tempCalibrationOffsetC: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export type HealthInsightCategory =
  | 'Cardiovascular'
  | 'Respiratory'
  | 'Metabolic'
  | 'Sleep & Recovery'
  | 'Hydration & Nutrition'
  | 'Vital Signs & Telemetry'
  | 'Stress Management';

export interface HealthInsight {
  id: string;
  title: string;
  category: HealthInsightCategory;
  tip: string;
  actionItem: string;
  relatedVital: string;
  evidenceSource: string;
  readTime: string;
  badge: string;
}

export type ReminderType = 'medication' | 'vitals';

export interface HealthReminder {
  id: string;
  type: ReminderType;
  title: string;
  dosageOrInstruction: string;
  time: string; // 24-hr format "HH:MM"
  days: string[]; // ['Daily'] or ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  enabled: boolean;
  targetVitals?: string[]; // e.g. ['Heart Rate', 'SpO2', 'Body Temp']
  soundAlert: boolean;
  browserNotification: boolean;
  lastTriggeredDate?: string; // "YYYY-MM-DD"
  lastCompletedDate?: string; // "YYYY-MM-DD"
  createdAt: string;
}
