import jsPDF from 'jspdf';
import { ScreeningReport } from '../types';

export const generateHospitalPDFReport = (report: ScreeningReport): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [14, 116, 144]; // Medical Cyan / Teal
  const darkColor = [30, 41, 59]; // Slate 800
  const lightGray = [248, 250, 252]; // Slate 50
  const accentBorder = [203, 213, 225]; // Slate 300

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 26, 'F');

  // Title: AI Health Screening Assistant
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AI HEALTH SCREENING ASSISTANT', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Biomedical IoT Sensor Telemetry & Preliminary Health Screening Assessment', 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`REPORT NO: ${report.reportNumber}`, 142, 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`DATE: ${new Date(report.createdAt).toLocaleDateString()} ${new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 142, 18);

  let y = 32;

  // 1. Patient Information Box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(14, y, 182, 30, 'F');
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(14, y, 182, 30, 'S');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 18, y + 6.5);

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${report.patient.name}`, 18, y + 14);
  doc.text(`Age / Gender: ${report.patient.age} yrs / ${report.patient.gender}`, 18, y + 20);
  doc.text(`Patient ID: ${report.patient.id || 'N/A'}`, 18, y + 26);

  doc.text(`Height: ${report.patient.heightCm} cm`, 105, y + 14);
  doc.text(`Weight: ${report.patient.weightKg} kg`, 105, y + 20);
  doc.text(`Known Conditions: ${report.patient.existingDiseases && report.patient.existingDiseases.length > 0 ? report.patient.existingDiseases.join(', ') : 'None'}`, 105, y + 26);

  y += 35;

  // 2. Vital Measurements Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('VITAL MEASUREMENTS (ESP32 SENSOR TELEMETRY)', 14, y);

  y += 4.5;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MEASURED VITAL SIGN', 18, y + 4.8);
  doc.text('RECORDED VALUE', 78, y + 4.8);
  doc.text('NORMAL REFERENCE RANGE', 130, y + 4.8);

  y += 7;

  const vitalsRows = [
    { name: 'Body Temperature (MLX90614 IR)', val: `${report.vitals.bodyTempC}°C (${report.vitals.bodyTempF}°F)`, ref: '36.1°C – 37.5°C (97.0°F – 99.5°F)' },
    { name: 'Heart Rate (MAX30102 PPG)', val: `${report.vitals.heartRate} BPM`, ref: '60 – 100 BPM (Resting)' },
    { name: 'Blood Oxygen Saturation (SpO₂)', val: `${report.vitals.spO2}%`, ref: '95% – 100%' },
  ];

  vitalsRows.forEach((row, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(14, y, 182, 6.5, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 6.5, 'S');

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(row.name, 18, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(row.val, 78, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text(row.ref, 130, y + 4.5);

    y += 6.5;
  });

  y += 5;

  // 3. Reported Symptoms & Preliminary Risk Level
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(14, y, 182, 20, 'F');
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(14, y, 182, 20, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('REPORTED SYMPTOMS:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  const symptomsText = report.patient.symptoms && report.patient.symptoms.length > 0
    ? report.patient.symptoms.join(', ')
    : 'None reported';
  doc.text(symptomsText, 18, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('PRELIMINARY RISK LEVEL:', 110, y + 6);
  doc.setFontSize(11);
  const riskColor = report.analysis.riskLevel === 'Low' ? [16, 185, 129] : report.analysis.riskLevel === 'Moderate' ? [217, 119, 6] : [225, 29, 72];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${report.analysis.riskLevel.toUpperCase()} RISK`, 110, y + 13);

  y += 24;

  // 4. Why This Result? Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('WHY THIS RESULT?', 14, y);

  y += 4;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(14, y, 182, 38, 'F');
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(14, y, 182, 38, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Screening Interpretation:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  const interpText = report.analysis.overallInterpretation || report.analysis.riskExplanation || report.analysis.healthSummary;
  const interpLines = doc.splitTextToSize(interpText, 172);
  doc.text(interpLines, 18, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('Notable Observations:', 18, y + 23);
  doc.setFont('helvetica', 'normal');
  const notableList = report.analysis.notableReadings && report.analysis.notableReadings.length > 0
    ? report.analysis.notableReadings.slice(0, 2)
    : ['All vital parameters are within acceptable baseline ranges.'];
  notableList.forEach((notable, nIdx) => {
    doc.text(`• ${notable}`, 22, y + 28 + nIdx * 4.5);
  });

  y += 42;

  // 5. Recommended Next Steps Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('RECOMMENDED NEXT STEPS', 14, y);

  y += 4;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(14, y, 182, 36, 'F');
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(14, y, 182, 36, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const steps = report.analysis.recommendedNextSteps && report.analysis.recommendedNextSteps.length > 0
    ? report.analysis.recommendedNextSteps
    : [
        'Continue regular monitoring and maintain healthy habits.',
        'Recheck vitals if symptoms continue or change.',
        'Consult a healthcare professional for persistent issues.',
      ];

  let stepY = y + 6;
  steps.slice(0, 3).forEach((step, sIdx) => {
    doc.text(`${sIdx + 1}. ${step}`, 18, stepY);
    stepY += 5;
  });

  doc.setFont('helvetica', 'bold');
  doc.text('When to Consult a Healthcare Professional:', 18, stepY + 2);
  doc.setFont('helvetica', 'normal');
  const consultText = report.analysis.whenToConsultDoctor || 'Consult a healthcare professional if symptoms persist or worsen.';
  doc.text(doc.splitTextToSize(consultText, 172), 18, stepY + 7);

  y += 42;

  // 6. Medical Disclaimer (Required verbatim)
  doc.setFillColor(254, 242, 242);
  doc.rect(14, y, 182, 14, 'F');
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, 182, 14, 'S');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MEDICAL DISCLAIMER:', 18, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    '“This is a preliminary health screening assessment and not a medical diagnosis. Consult a qualified healthcare professional for medical advice.”',
    18,
    y + 9
  );

  y += 18;

  // Signature line
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);

  y += 5;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('AI Health Screening Assistant • Diploma CSE Project Telemetry System', 14, y + 3);

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('EXAMINER / CLINICAL OPERATOR SIGNATURE:', 125, y + 3);
  doc.setFont('helvetica', 'normal');
  doc.text('____________________________________', 125, y + 9);

  // Save the PDF
  doc.save(`Health_Screening_Report_${report.reportNumber}.pdf`);
};
