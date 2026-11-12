import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import {
  LanguageCode,
  getStoredLanguage,
  saveLanguage,
  toLocale,
} from './languageStorage';

export {SUPPORTED_LANGUAGES, toLocale} from './languageStorage';
export type {LanguageCode} from './languageStorage';

const initial = getStoredLanguage() || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    hi: {translation: hi},
    mr: {translation: mr},
  },
  lng: initial,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  returnNull: false,
});

if (typeof document !== 'undefined') document.documentElement.lang = initial;

/** Switch the whole app's language instantly and persist it (per user when given). */
export const setLanguage = (code: LanguageCode, userId?: string | null) => {
  saveLanguage(code, userId);
  if (typeof document !== 'undefined') document.documentElement.lang = code;
  return i18n.changeLanguage(code);
};

/** Locale for the active language — for toLocaleDateString etc. */
export const currentLocale = () => toLocale(i18n.language);

export default i18n;
