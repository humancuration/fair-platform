import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { /* English translations */ } },
      es: { translation: { /* Spanish translations */ } },
      // Add more languages as needed
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: { escapeValue: false }, // React already does escaping
  });

export default i18n;