import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import htTranslations from './locales/ht.json';
import frTranslations from './locales/fr.json';

const resources = {
  ht: {
    translation: htTranslations
  },
  fr: {
    translation: frTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ht', // default language
    fallbackLng: 'ht',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

if (import.meta.env.DEV) window.__i18n = i18n; // dev-only hook (used by responsive checks)
