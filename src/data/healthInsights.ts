import { HealthInsight } from '../types';

export const HEALTH_INSIGHTS: HealthInsight[] = [
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
  {
    id: 'hi-11',
    title: 'Subtle Biomarkers of Incipient Viral Infection',
    category: 'Vital Signs & Telemetry',
    tip: 'An elevated resting heart rate combined with a subtle 0.3°C increase in baseline core temperature often precedes subjective symptoms (such as body aches or sore throat) by 12 to 24 hours as the innate immune response ramps up cytokine activity.',
    actionItem: 'Use Aura Health’s Patient Screening tool if your daily telemetry reveals uncharacteristic vital spikes.',
    relatedVital: 'Heart Rate & Core Body Temperature',
    evidenceSource: 'Digital Health & Physiological Biomarkers Journal',
    readTime: '1 min read',
    badge: 'Immunology',
  },
  {
    id: 'hi-12',
    title: 'Dietary Nitrates for Endothelial Vasodilation',
    category: 'Hydration & Nutrition',
    tip: 'Inorganic dietary nitrates found in vegetables such as arugula, beets, and swiss chard are converted by oral bacteria into nitric oxide (NO). Nitric oxide signals vascular smooth muscle to relax, promoting lower peripheral vascular resistance and healthy systemic circulation.',
    actionItem: 'Include dark leafy greens or beetroot in at least one meal today to encourage natural nitric oxide synthesis.',
    relatedVital: 'Arterial Elasticity & Peripheral Perfusion',
    evidenceSource: 'British Journal of Clinical Pharmacology',
    readTime: '2 min read',
    badge: 'Vascular Health',
  },
];

/**
 * Returns a randomized health insight from the collection
 */
export const getRandomHealthInsight = (excludeId?: string): HealthInsight => {
  const pool = excludeId
    ? HEALTH_INSIGHTS.filter((item) => item.id !== excludeId)
    : HEALTH_INSIGHTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || HEALTH_INSIGHTS[0];
};

/**
 * Returns a deterministic "Daily" insight based on current calendar date
 */
export const getDailyHealthInsight = (): HealthInsight => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = Math.abs(dayOfYear) % HEALTH_INSIGHTS.length;
  return HEALTH_INSIGHTS[index];
};
