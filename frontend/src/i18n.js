import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Явный импорт файлов перевода
import ru from "./locales/ru.json";
import kz from "./locales/kz.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      kz: { translation: kz },
      en: { translation: en },
    },
    fallbackLng: "ru", // Язык по умолчанию
    debug: false,
    interpolation: {
      escapeValue: false, // React сам защищает от XSS
    },
  });

export default i18n;
