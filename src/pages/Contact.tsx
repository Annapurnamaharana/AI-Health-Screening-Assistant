import React, { useState } from 'react';
import { PhoneCall, Mail, User, Phone, MessageSquare, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Contact: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hardware Support');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Message Sent', 'Thank you! Our engineering / clinical team will respond shortly.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold shadow-xs">
          <PhoneCall className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Telehealth & Technical Support</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact & Consultation Hotline</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Book specialist physician consultations or request technical assistance for ESP32 sensor hardware assembly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Send Telehealth / Support Inquiry</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Alexander Vance"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@clinic.org"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Inquiry Type</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors cursor-pointer"
              >
                <option value="Hardware Support">ESP32 Sensor Hardware Wiring Support</option>
                <option value="Telehealth Doctor">Book Telehealth Doctor Appointment</option>
                <option value="Diploma Inquiry">Diploma Project Academic Research</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-xs transition-colors"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>

        {/* Right Emergency Hotlines List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Medical Services</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If patient SpO2 falls below 90% or patient experiences acute chest pain, contact local emergency services immediately:
            </p>

            <div className="space-y-3 text-xs">
              <a
                href="tel:108"
                className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-700 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">Medical Emergency Hotline</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">24/7 Rapid Ambulance & Emergency Triage</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                  <span>📞</span>
                  <span>108</span>
                </div>
              </a>

              <a
                href="tel:14416"
                className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-cyan-950/30 border border-blue-200 dark:border-cyan-900/50 hover:border-blue-400 dark:hover:border-cyan-700 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">Telehealth Support</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Government & Medical Tele-Consultation</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-mono font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                  <span>📞</span>
                  <span>14416</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
