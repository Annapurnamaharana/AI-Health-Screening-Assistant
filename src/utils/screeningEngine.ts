import { AIAnalysisResult, PatientInfo, RiskLevel, SensorReading, VitalSignObservation } from '../types';

export function evaluateHealthScreening(patient: PatientInfo, vitals: SensorReading): AIAnalysisResult {
  const { bodyTempC, heartRate, spO2 } = vitals;
  const symptoms = patient.symptoms || [];

  // 1. Evaluate Heart Rate
  let hrStatus: VitalSignObservation['status'] = 'Normal';
  let hrInterp = `Normal resting pulse of ${heartRate} BPM (reference: 60–100 BPM).`;
  if (heartRate < 50) {
    hrStatus = 'Low';
    hrInterp = `Marked bradycardia detected (${heartRate} BPM, below 50 BPM).`;
  } else if (heartRate < 60) {
    hrStatus = 'Low';
    hrInterp = `Mild resting bradycardia (${heartRate} BPM, normal in well-trained individuals).`;
  } else if (heartRate > 115) {
    hrStatus = 'High';
    hrInterp = `Elevated heart rate / tachycardia (${heartRate} BPM, above 115 BPM).`;
  } else if (heartRate > 100) {
    hrStatus = 'Elevated';
    hrInterp = `Mildly elevated resting pulse (${heartRate} BPM, slightly above normal range).`;
  }

  // 2. Evaluate SpO2
  let spo2Status: VitalSignObservation['status'] = 'Normal';
  let spo2Interp = `Healthy blood oxygen saturation of ${spO2}% (reference: 95%–100%).`;
  if (spO2 < 90) {
    spo2Status = 'High'; // Severe flag
    spo2Interp = `Significantly low oxygen saturation (${spO2}%), indicating compromised oxygen delivery.`;
  } else if (spO2 < 94) {
    spo2Status = 'Low';
    spo2Interp = `Mildly decreased oxygen saturation (${spO2}%, borderline threshold 94%).`;
  }

  // 3. Evaluate Body Temperature
  let tempStatus: VitalSignObservation['status'] = 'Normal';
  let tempInterp = `Normal core body temperature of ${bodyTempC}°C (${vitals.bodyTempF}°F).`;
  if (bodyTempC >= 38.5) {
    tempStatus = 'High';
    tempInterp = `High fever / hyperpyrexia (${bodyTempC}°C / ${vitals.bodyTempF}°F).`;
  } else if (bodyTempC > 37.5) {
    tempStatus = 'Elevated';
    tempInterp = `Low-grade fever / elevated temperature (${bodyTempC}°C / ${vitals.bodyTempF}°F).`;
  } else if (bodyTempC < 35.5) {
    tempStatus = 'Low';
    tempInterp = `Below-normal core temperature (${bodyTempC}°C), risk of hypothermia.`;
  }

  const vitalSignsConsidered: VitalSignObservation[] = [
    {
      name: 'Heart Rate (Pulse)',
      value: `${heartRate} BPM`,
      status: hrStatus,
      interpretation: hrInterp,
    },
    {
      name: 'Blood Oxygen (SpO₂)',
      value: `${spO2}%`,
      status: spo2Status,
      interpretation: spo2Interp,
    },
    {
      name: 'Body Temperature',
      value: `${bodyTempC}°C (${vitals.bodyTempF}°F)`,
      status: tempStatus,
      interpretation: tempInterp,
    },
  ];

  // 4. Identify Notable Readings
  const notableReadings: string[] = [];
  if (tempStatus === 'High' || tempStatus === 'Elevated') {
    notableReadings.push(`Body temperature is elevated at ${bodyTempC}°C (${vitals.bodyTempF}°F).`);
  }
  if (spo2Status !== 'Normal') {
    notableReadings.push(`Blood oxygen saturation (SpO₂) is low at ${spO2}%.`);
  }
  if (hrStatus !== 'Normal') {
    notableReadings.push(`Resting heart rate is ${heartRate} BPM (${hrStatus.toLowerCase()}).`);
  }
  if (symptoms.length > 0) {
    notableReadings.push(`Reported presenting symptoms: ${symptoms.join(', ')}.`);
  }
  if (notableReadings.length === 0) {
    notableReadings.push('All measured vital signs and physiological markers are within healthy standard limits.');
  }

  // 5. Determine Preliminary Risk Level
  const hasChestPainOrDyspnea = symptoms.some((s) =>
    /chest pain|shortness of breath|breathlessness|difficulty breathing/i.test(s)
  );

  let riskLevel: RiskLevel = 'Low';
  let riskScore = 15;

  if (spO2 < 92 || bodyTempC >= 38.8 || heartRate >= 125 || heartRate < 45 || (hasChestPainOrDyspnea && (bodyTempC > 38.0 || spO2 < 95))) {
    riskLevel = 'High';
    riskScore = Math.max(75, Math.min(95, 75 + (spO2 < 90 ? 15 : 0) + (bodyTempC > 39.0 ? 10 : 0)));
  } else if (
    spO2 < 95 ||
    bodyTempC > 37.5 ||
    heartRate > 100 ||
    heartRate < 55 ||
    symptoms.length >= 2 ||
    hasChestPainOrDyspnea
  ) {
    riskLevel = 'Moderate';
    riskScore = Math.max(35, Math.min(68, 35 + symptoms.length * 6 + (bodyTempC > 38.0 ? 12 : 0)));
  }

  // 6. Formulate Explanations
  let riskExplanation = '';
  let overallInterpretation = '';
  let recommendedNextSteps: string[] = [];
  let whenToConsultDoctor = '';

  if (riskLevel === 'Low') {
    riskExplanation = 'All vital signs are in standard physiological reference ranges, and no severe or alarming symptoms were reported.';
    overallInterpretation = `Patient ${patient.name} (${patient.age}y/o ${patient.gender}) demonstrates stable cardiovascular parameters and balanced body temperature. Vitals are consistent with normal physiological baseline.`;
    recommendedNextSteps = [
      'Continue normal daily routine and maintain active, healthy lifestyle habits.',
      'Stay well hydrated with 2 to 3 liters of clean water daily.',
      'Recheck vitals using the assistant if you feel fatigued or if new symptoms appear.',
      'Maintain balanced nutrition and 7–8 hours of restful nightly sleep.',
    ];
    whenToConsultDoctor = 'Consult a healthcare professional during routine check-ups, or sooner if you notice unexpected or persistent new symptoms.';
  } else if (riskLevel === 'Moderate') {
    const notableSummary = [];
    if (bodyTempC > 37.5) notableSummary.push(`elevated body temperature (${bodyTempC}°C)`);
    if (spO2 < 95) notableSummary.push(`mildly reduced oxygen (${spO2}%)`);
    if (heartRate > 100) notableSummary.push(`elevated pulse (${heartRate} BPM)`);
    if (symptoms.length > 0) notableSummary.push(`reported symptoms (${symptoms.join(', ')})`);

    riskExplanation = `Moderate risk identified due to ${notableSummary.join(' and ')}. These findings warrant active monitoring and restful care.`;
    overallInterpretation = `Assessment indicates mild to moderate physiological strain. While vital signs remain functional, the combination of readings suggests the body may be responding to an early infection, fatigue, or stress.`;
    recommendedNextSteps = [
      'Rest comfortably at home and avoid strenuous physical exertion or intense workouts.',
      'Drink warm fluids, clear soups, and oral electrolytes to stay adequately hydrated.',
      'Recheck temperature, pulse, and oxygen saturation every 4 to 6 hours to track changes.',
      'Document any progression of symptoms in the Patient History log.',
    ];
    whenToConsultDoctor = 'Consider consulting a healthcare professional if symptoms persist beyond 24 to 48 hours, if fever reaches 38.5°C, or if you feel increasingly unwell.';
  } else {
    // High Risk
    riskExplanation = 'High risk flagged because one or more vital parameters or reported symptoms show significant deviation from normal thresholds.';
    overallInterpretation = `The entered readings (${bodyTempC}°C temp, ${heartRate} BPM, ${spO2}% SpO₂) combined with symptoms reflect acute physiological strain. Prompt professional clinical evaluation is strongly recommended.`;
    recommendedNextSteps = [
      'Seek prompt medical attention from a qualified physician, nearby clinic, or urgent care facility.',
      'Sit comfortably upright in a well-ventilated area and avoid any physical exertion.',
      'Have a family member, friend, or caregiver accompany you during your medical consultation.',
      'Keep a record of these vital measurements to share with the attending healthcare provider.',
    ];
    whenToConsultDoctor = 'Seek immediate medical attention. Do not delay if experiencing chest tightness, breathing difficulties, high unyielding fever, or lightheadedness.';
  }

  const disclaimer = 'This is a preliminary health screening assessment and not a medical diagnosis. Consult a qualified healthcare professional for medical advice.';

  return {
    riskLevel,
    riskScore,
    riskExplanation,
    vitalSignsConsidered,
    symptomsReported: symptoms,
    notableReadings,
    overallInterpretation,
    recommendedNextSteps,
    whenToConsultDoctor,
    disclaimer,
    healthSummary: overallInterpretation,
    aiDiagnosisSuggestions: [
      riskLevel === 'High' ? 'Acute Physiological Strain / Needs Evaluation' : riskLevel === 'Moderate' ? 'Mild Reactive State / Symptom Monitoring' : 'Stable Physiological Profile',
      bodyTempC > 38.0 ? 'Fever / Pyrexia under observation' : 'Normothermia',
      spO2 < 94 ? 'Borderline oxygen saturation under observation' : 'Optimal oxygen saturation',
    ],
    lifestyleAdvice: recommendedNextSteps,
    dietAdvice: [
      'Consume light, nutrient-dense meals including fresh fruits and vegetables.',
      'Avoid high-sodium processed foods and excess refined sugar.',
    ],
    hydrationAdvice: riskLevel === 'High' ? 'Hydrate frequently with water or electrolyte fluids as tolerated.' : 'Maintain 2.5 to 3.0 liters of fluid intake daily.',
    sleepRecommendation: 'Ensure 7 to 9 hours of restorative sleep in a quiet, dark environment.',
    exerciseRecommendation: riskLevel === 'Low' ? '30 minutes of light aerobic walking daily.' : 'Rest and avoid physical exertion until vitals stabilize.',
    doctorConsultationRequired: riskLevel === 'High' || riskLevel === 'Moderate',
    doctorConsultationReason: whenToConsultDoctor,
  };
}
