import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { evaluateHealthScreening } from './src/utils/screeningEngine';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory telemetry cache & history store
let currentHardwareState = {
  esp32: 'Connected',
  max30102: 'Active (IR/Red)',
  mlx90614: 'Active (I2C 0x5A)',
  oledDisplay: 'Online (128x64)',
  buzzerState: 'Idle',
  ledState: 'Off',
  ipAddress: '192.168.1.105',
};

let currentVitals = {
  bodyTempC: 36.8,
  bodyTempF: 98.2,
  heartRate: 74,
  spO2: 98,
  pnn50: 22,
  rmssd: 34,
  signalQuality: 98,
  wifiSignal: -62,
  timestamp: new Date().toISOString(),
};

const savedReports: any[] = [];

// Gemini AI Client setup
let genAIClient: GoogleGenAI | null = null;
const getGeminiClient = () => {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
};

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect Hardware
app.post('/api/connect', (req, res) => {
  const { ipAddress } = req.body;
  currentHardwareState.esp32 = 'Connected';
  if (ipAddress) currentHardwareState.ipAddress = ipAddress;
  res.json({ success: true, hardwareState: currentHardwareState });
});

// Disconnect Hardware
app.post('/api/disconnect', (req, res) => {
  currentHardwareState.esp32 = 'Disconnected';
  res.json({ success: true, hardwareState: currentHardwareState });
});

// Sensor Data Telemetry Ingestion (ESP32 POST target)
app.post('/api/sensor-data', (req, res) => {
  const { bodyTempC, heartRate, spO2 } = req.body;
  if (typeof bodyTempC === 'number') {
    currentVitals.bodyTempC = parseFloat(bodyTempC.toFixed(1));
    currentVitals.bodyTempF = parseFloat(((bodyTempC * 9) / 5 + 32).toFixed(1));
  }
  if (typeof heartRate === 'number') currentVitals.heartRate = Math.round(heartRate);
  if (typeof spO2 === 'number') currentVitals.spO2 = Math.round(spO2);
  currentVitals.timestamp = new Date().toISOString();

  res.json({ success: true, received: currentVitals });
});

// Live Data Polling Endpoint
app.get('/api/live', (req, res) => {
  res.json({ vitals: currentVitals, hardwareState: currentHardwareState });
});

// Hardware Control Test Trigger
app.post('/api/hardware/control', (req, res) => {
  const { component, command } = req.body;
  if (component === 'buzzer') {
    currentHardwareState.buzzerState = 'Beeping (1000Hz)';
    setTimeout(() => {
      currentHardwareState.buzzerState = 'Idle';
    }, 1500);
  } else if (component === 'led') {
    currentHardwareState.ledState = command || 'Toggled';
  }
  res.json({ success: true, hardwareState: currentHardwareState });
});

// Save Screening Report
app.post('/api/report', async (req, res) => {
  const { patient, vitals } = req.body;

  const reportId = `rep-${Date.now()}`;
  const reportNumber = `HP-${Math.floor(100000 + Math.random() * 900000)}`;

  const analysis = evaluateHealthScreening(patient, vitals);

  // Attempt real Gemini enrichment if API key present
  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are an assistive health screening engine (not replacing a physician). Provide a concise 2-sentence summary for this patient:
Name: ${patient?.name || 'Patient'}, ${patient?.age}y/o. Symptoms: ${patient?.symptoms?.join(', ') || 'None'}.
Vitals: Temp ${vitals?.bodyTempC}°C, Pulse ${vitals?.heartRate} BPM, SpO2 ${vitals?.spO2}%. Preliminary Risk: ${analysis.riskLevel}.
Remember: Do not claim to diagnose diseases. Keep advice general.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        analysis.overallInterpretation = response.text.trim();
        analysis.healthSummary = response.text.trim();
      }
    }
  } catch (err) {
    console.log('Gemini API call optional fallback:', err);
  }

  const newReport = {
    id: reportId,
    reportNumber,
    createdAt: new Date().toISOString(),
    patient,
    vitals,
    analysis,
    healthScore: Math.max(10, 100 - analysis.riskScore),
  };

  savedReports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

// Patient History Endpoint
app.get('/api/history', (req, res) => {
  res.json({ reports: savedReports });
});

// AI Analyze Standalone Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  const { patient, vitals } = req.body;
  const analysis = evaluateHealthScreening(patient, vitals);
  res.json({ success: true, analysis });
});

// Daily Health Insight Endpoint
app.get('/api/daily-health-insight', (req, res) => {
  const isRandom = req.query.random === 'true';
  const excludeId = req.query.excludeId as string | undefined;

  const serverInsights = [
    {
      id: 'hi-01',
      title: 'Optimal Resting Heart Rate Benchmarks',
      category: 'Cardiovascular',
      tip: 'A standard healthy adult resting heart rate spans 60 to 100 beats per minute. Well-conditioned cardiovascular systems often maintain resting rates in the 50s due to superior stroke volume per contraction. Consistently elevated resting rates above 85 BPM can warrant evaluation for dehydration, stress, or caffeine overconsumption.',
      actionItem: 'Measure your resting pulse first thing in the morning before consuming caffeine or getting out of bed.',
      relatedVital: 'Resting Pulse: 60-100 BPM',
      evidenceSource: 'American Heart Association & Clinical Cardiology Guidelines',
      readTime: '1 min read',
      badge: 'Cardiology',
    },
    {
      id: 'hi-02',
      title: 'Understanding Pulse Oximetry (SpO2) at Rest',
      category: 'Respiratory',
      tip: 'Healthy resting oxygen saturation (SpO2) reliably stays between 95% and 100%. When using optical finger sensors like the MAX30102, cold fingers or poor capillary perfusion can trigger artificial low readings. Warming the hands and sitting quietly for 2 minutes before measuring yields true clinical baseline numbers.',
      actionItem: 'If SpO2 reads below 95%, sit upright, perform 5 slow belly breaths, and warm your hands before re-testing.',
      relatedVital: 'Oxygen Saturation: 95-100%',
      evidenceSource: 'World Health Organization Pulse Oximetry Guidance',
      readTime: '1 min read',
      badge: 'Pulmonology',
    },
    {
      id: 'hi-03',
      title: 'Hydration’s Direct Impact on Cardiac Workload',
      category: 'Hydration & Nutrition',
      tip: 'Even mild hypohydration (1-2% loss of body weight in water) thickens blood viscosity and decreases venous return, forcing the myocardium to beat 8 to 15 BPM faster to sustain target arterial pressure. Proper electrolyte balance supports stable cardiac conduction.',
      actionItem: 'Drink 300 to 500 mL of water upon waking up to replenish fluids lost through nocturnal respiration and sweat.',
      relatedVital: 'Vascular Hemodynamics & Pulse Stability',
      evidenceSource: 'Journal of Applied Physiology & Hydration Science',
      readTime: '1 min read',
      badge: 'Hydration',
    },
    {
      id: 'hi-04',
      title: 'Circadian Core Temperature Fluctuations',
      category: 'Vital Signs & Telemetry',
      tip: 'Human core temperature naturally fluctuates by up to 0.5°C (0.9°F) across a 24-hour cycle. It reaches its nadir during early morning hours (4:00–6:00 AM) and peaks in late afternoon (5:00–7:00 PM). Infrared MLX90614 readings between 36.1°C and 37.2°C (97.0°F–99.0°F) reflect typical biological diurnal shifts.',
      actionItem: 'Document the exact time of day when tracking temperature to prevent misinterpreting natural afternoon peaks as mild fever.',
      relatedVital: 'Core Temperature: 36.5°C - 37.2°C',
      evidenceSource: 'Clinical Thermometry & Chronobiology Standards',
      readTime: '2 min read',
      badge: 'Thermoregulation',
    },
    {
      id: 'hi-05',
      title: 'The 10-Minute Postprandial Glucose Walk',
      category: 'Metabolic',
      tip: 'Light physical activity within 30 minutes following a meal stimulates skeletal muscle GLUT4 glucose transporter translocation without requiring extra insulin production. A brisk 10 to 15-minute walk can attenuate postprandial glycemic excursions by up to 25–30%.',
      actionItem: 'Replace post-dinner couch sitting with a gentle 10-minute stroll around your living space or neighborhood.',
      relatedVital: 'Metabolic Glycemia & Insulin Sensitivity',
      evidenceSource: 'Diabetes Care & Sports Medicine Research',
      readTime: '1 min read',
      badge: 'Metabolic',
    },
    {
      id: 'hi-06',
      title: 'Deep Sleep & Vascular Endothelial Repair',
      category: 'Sleep & Recovery',
      tip: 'During Stage 3 Non-REM (slow-wave) deep sleep, parasympathetic vagal dominance induces physiological bradycardia and vasodilation, giving the vascular endothelium essential time for cellular regeneration. Chronic sleep deficit under 6.5 hours correlates with stiffened arterial elasticity.',
      actionItem: 'Keep your bedroom cool (18°C–20°C / 65°F–68°F) and dim bright screens 45 minutes before sleep to stimulate endogenous melatonin.',
      relatedVital: 'Nocturnal Bradycardia & HRV',
      evidenceSource: 'Sleep Medicine Reviews & National Sleep Foundation',
      readTime: '2 min read',
      badge: 'Sleep Science',
    },
    {
      id: 'hi-07',
      title: '4-7-8 Breathing Technique for Autonomic Regulation',
      category: 'Stress Management',
      tip: 'Inhaling for 4 seconds, holding for 7 seconds, and exhaling slowly through pursed lips for 8 seconds stimulates the cardiac vagus nerve. This rapid autonomic feedback loop triggers acetylcholine release, which naturally slows sinoatrial nodal firing and eases high sympathetic tone.',
      actionItem: 'Perform 4 repetitions of the 4-7-8 cycle whenever noticing physical signs of acute mental strain or high heart rate.',
      relatedVital: 'Heart Rate Variability (HRV) & Vagal Tone',
      evidenceSource: 'Integrative Medicine & Autonomic Neuroscience',
      readTime: '1 min read',
      badge: 'Neuro-Cardiology',
    },
    {
      id: 'hi-08',
      title: 'Contactless IR Thermometry: Avoiding Thermal Artifacts',
      category: 'Vital Signs & Telemetry',
      tip: 'When reading surface temperature with the MLX90614 sensor, surface perspiration, residual makeup, or close proximity to warm devices can skew optical readings. Ensure the test forehead or wrist skin is dry and maintain a steady 2 to 5 cm perpendicular distance for calibrated accuracy.',
      actionItem: 'Wipe the measurement site dry and maintain an exact 3 cm perpendicular standoff distance during hardware scanning.',
      relatedVital: 'MLX90614 Contactless Telemetry Precision',
      evidenceSource: 'Biomedical Sensor Engineering Manual',
      readTime: '1 min read',
      badge: 'Hardware Sensor',
    },
    {
      id: 'hi-09',
      title: 'Electrolytes & Myocardial Rhythm Stability',
      category: 'Cardiovascular',
      tip: 'Potassium and magnesium are the primary intracellular cations maintaining myocardial action potentials. Insufficient dietary intake can predispose individuals to harmless but uncomfortable premature ventricular contractions (flutter sensations) and heightened muscle cramping.',
      actionItem: 'Add potassium and magnesium-dense foods like avocado, spinach, or pumpkin seeds to your daily nutrition plan.',
      relatedVital: 'Myocardial Conduction & Regular Rhythm',
      evidenceSource: 'Harvard School of Public Health & Electrolyte Cardiology',
      readTime: '1 min read',
      badge: 'Nutrition',
    },
    {
      id: 'hi-10',
      title: 'Thoracic Expansion for Postural Lung Aeration',
      category: 'Respiratory',
      tip: 'Prolonged sitting with forward rounded shoulders restricts full diaphragmatic descent, reducing pulmonary tidal volume by up to 15%. This partial alveolar hypoventilation can contribute to mid-afternoon lethargy and subtle drops in perceived cognitive alertness.',
      actionItem: 'Stand up every 45 minutes, roll your shoulders backward, and expand your ribcage with three deep chest breaths.',
      relatedVital: 'Respiratory Tidal Volume & SpO2',
      evidenceSource: 'Pulmonary Rehabilitation & Ergonomics Society',
      readTime: '1 min read',
      badge: 'Ergonomics',
    },
  ];

  let chosenInsight;
  if (isRandom) {
    const pool = excludeId
      ? serverInsights.filter((item) => item.id !== excludeId)
      : serverInsights;
    const randomIndex = Math.floor(Math.random() * pool.length);
    chosenInsight = pool[randomIndex] || serverInsights[0];
  } else {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    chosenInsight = serverInsights[Math.abs(dayOfYear) % serverInsights.length];
  }

  res.json({
    success: true,
    insight: chosenInsight,
    fetchedAt: new Date().toISOString(),
    isRandomized: Boolean(isRandom),
  });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthPulse AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
