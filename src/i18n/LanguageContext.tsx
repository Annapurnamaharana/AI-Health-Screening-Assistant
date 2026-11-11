import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types/i18n';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'aura_health_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'od')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Could not save language to localStorage:', err);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Set the HTML lang attribute appropriately (ISO 639-1: 'en', 'hi', 'or')
      document.documentElement.lang = language === 'od' ? 'or' : language;
    }
  }, [language]);

  /**
   * Helper function to retrieve nested translated string by dot notation (e.g. "nav.home")
   */
  const t = (key: string, fallback?: string): string => {
    if (!key) return '';

    const getNestedValue = (obj: any, path: string): string | undefined => {
      const keys = path.split('.');
      let current = obj;
      for (const k of keys) {
        if (current === undefined || current === null) return undefined;
        current = current[k];
      }
      return typeof current === 'string' ? current : undefined;
    };

    // 1. Try current language
    const currentLangTranslations = translations[language];
    let val = getNestedValue(currentLangTranslations, key);
    if (val !== undefined) return val;

    // 2. Fallback to English
    if (language !== 'en') {
      val = getNestedValue(translations.en, key);
      if (val !== undefined) return val;
    }

    // 3. Fallback string or key
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
