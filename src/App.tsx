import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ActiveReminderModal } from './components/ActiveReminderModal';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { HealthScreening } from './pages/HealthScreening';
import { LiveDashboard } from './pages/LiveDashboard';
import { Dashboard } from './pages/Dashboard';
import { DiseaseLibrary } from './pages/DiseaseLibrary';
import { BMICalculator } from './pages/BMICalculator';
import { Reports } from './pages/Reports';
import { PatientHistory } from './pages/PatientHistory';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Settings } from './pages/Settings';
import { Reminders } from './pages/Reminders';

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
            <ToastContainer />
            <ActiveReminderModal />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/health-screening" element={<HealthScreening />} />
                <Route path="/live-dashboard" element={<LiveDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/disease-library" element={<DiseaseLibrary />} />
                <Route path="/bmi-calculator" element={<BMICalculator />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/patient-history" element={<PatientHistory />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
}
