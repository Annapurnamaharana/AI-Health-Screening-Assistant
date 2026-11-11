import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../types/i18n';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'compact' | 'settings';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    SUPPORTED_LANGUAGES.find((opt) => opt.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // If used in Settings as full cards
  if (variant === 'settings') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {SUPPORTED_LANGUAGES.map((opt) => {
          const isSelected = opt.code === language;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => handleSelect(opt.code)}
              aria-label={`Select language ${opt.label}`}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-50 dark:bg-cyan-950/50 border-blue-500 dark:border-cyan-400 text-slate-900 dark:text-white shadow-xs ring-2 ring-blue-500/20 dark:ring-cyan-500/20'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none" role="img" aria-label={opt.label}>
                  {opt.flag}
                </span>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                    {opt.nativeLabel}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {opt.label} ({opt.shortLabel})
                  </span>
                </div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Navbar / Header dropdown selector
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Language selector: current is ${currentOption.label}`}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
        <span className="font-medium">{currentOption.nativeLabel}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('common.selectLanguage', 'Select Language')}
            </span>
          </div>

          <div className="p-1 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm leading-none" role="img" aria-label={opt.label}>
                      {opt.flag}
                    </span>
                    <div className="text-left">
                      <span className="block leading-tight">{opt.nativeLabel}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {opt.label} ({opt.shortLabel})
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
