import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  BookOpen,
  Calculator,
  FileSpreadsheet,
  History,
  HelpCircle,
  PhoneCall,
  Settings,
  Info,
  Cpu,
  Sun,
  Moon,
  Menu,
  X,
  Radio,
  Bell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { NavbarReminderBell } from './NavbarReminderBell';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { hardwareState, settings, toggleTheme } = useApp();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', defaultName: 'Home', path: '/', icon: Activity },
    { key: 'nav.about', defaultName: 'About', path: '/about', icon: Info },
    { key: 'nav.screening', defaultName: 'Screening', path: '/health-screening', icon: Stethoscope },
    { key: 'nav.liveVitals', defaultName: 'Live Vitals', path: '/live-dashboard', icon: Radio },
    { key: 'nav.dashboard', defaultName: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.reminders', defaultName: 'Reminders', path: '/reminders', icon: Bell },
    { key: 'nav.diseaseLibrary', defaultName: 'Disease Library', path: '/disease-library', icon: BookOpen },
    { key: 'nav.bmiCalculator', defaultName: 'BMI Calculator', path: '/bmi-calculator', icon: Calculator },
    { key: 'nav.reports', defaultName: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { key: 'nav.patientHistory', defaultName: 'Patient History', path: '/patient-history', icon: History },
    { key: 'nav.faq', defaultName: 'FAQ', path: '/faq', icon: HelpCircle },
    { key: 'nav.contact', defaultName: 'Contact', path: '/contact', icon: PhoneCall },
    { key: 'nav.settings', defaultName: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-gradient-to-tr dark:from-cyan-500 dark:to-emerald-400 p-0.5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-blue-600 dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white dark:text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Aura<span className="text-blue-600 dark:text-cyan-400">Health</span>
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                IoT Medical Screening
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200/70 font-semibold shadow-xs dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(item.key, item.defaultName)}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector, Reminders Bell, ESP32 Hardware Status & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="navbar" />

            {/* Health Reminders Bell Notification Center */}
            <NavbarReminderBell />

            {/* Hardware Status Pill */}
            <NavLink
              to="/live-dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 text-xs text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="font-mono text-[11px] font-semibold">ESP32</span>
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    hardwareState.esp32 === 'Connected' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    hardwareState.esp32 === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  hardwareState.esp32 === 'Connected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {hardwareState.esp32}
              </span>
            </NavLink>

            {/* Single Unified Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title={settings.theme === 'dark' ? 'Switch to ☀️ Light Theme' : 'Switch to 🌙 Dark Theme'}
              aria-label="Toggle Light / Dark Theme"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
              <span className="hidden xl:inline text-xs font-semibold">
                {settings.theme === 'dark' ? t('nav.lightMode', 'Light') : t('nav.darkMode', 'Dark')}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button, Language Selector, Reminder Bell & Mobile Theme Toggle */}
          <div className="flex lg:hidden items-center gap-1.5">
            <LanguageSelector variant="navbar" />
            <NavbarReminderBell />

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={settings.theme === 'dark' ? 'Switch to ☀️ Light Theme' : 'Switch to 🌙 Dark Theme'}
              aria-label="Toggle Light / Dark Theme"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {/* Hardware pill mobile */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">ESP32 Hardware Module</span>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                hardwareState.esp32 === 'Connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
              }`}
            >
              {hardwareState.esp32}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t(item.key, item.defaultName)}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
