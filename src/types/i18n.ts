export type Language = 'en' | 'hi' | 'od';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    shortLabel: 'EN',
    flag: '🇺🇸',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    shortLabel: 'HI',
    flag: '🇮🇳',
  },
  {
    code: 'od',
    label: 'Odia',
    nativeLabel: 'ଓଡ଼ିଆ',
    shortLabel: 'OD',
    flag: '🇮🇳',
  },
];
