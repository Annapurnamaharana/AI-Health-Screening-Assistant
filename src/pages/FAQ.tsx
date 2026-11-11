import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Stethoscope, ShieldAlert } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the ESP32 connect to the MAX30102 and MLX90614 sensors?',
      a: 'Both sensors operate on the standard I2C protocol. They share the I2C bus on GPIO21 (SDA) and GPIO22 (SCL). The MAX30102 uses I2C address 0x57, while the MLX90614 uses 0x5A, allowing simultaneous telemetry without address collision.',
    },
    {
      q: 'Is the AI diagnosis replacing a doctor examination?',
      a: 'No. The Gemini AI engine provides preliminary risk stratifying, health summaries, and lifestyle guidance for screening and triage purposes. It explicitly flags high fever or low SpO2 for mandatory clinical doctor review.',
    },
    {
      q: 'Can I flash the C++ Arduino source code directly to an ESP32 board?',
      a: 'Yes! Navigate to the About page to copy the complete Arduino IDE sketch. Install the required libraries (Adafruit_MLX90614, MAX30105, Adafruit_SSD1306), update your Wi-Fi SSID/password, and upload.',
    },
    {
      q: 'How are hospital-style PDF reports generated?',
      a: 'Reports are compiled client-side using jsPDF. They combine patient demographics, live sensor telemetry, AI diagnostic findings, risk assessment badges, and physician signature blocks into an official printable document.',
    },
    {
      q: 'What happens if the ESP32 hardware is disconnected?',
      a: 'The system seamlessly falls back to a simulated hardware telemetry stream, ensuring full software demonstration capabilities during project evaluation or presentations.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Help & Troubleshooting Guide</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Get quick answers regarding hardware pinout wiring, Gemini AI integration, sensor calibration, and diploma project presentation.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{faq.q}</h3>
                {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
