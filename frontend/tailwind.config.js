/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Основной синий (кнопки, акценты)
        primaryHover: "#1D4ED8", // Синий при наведении
        bgLight: "#EEF2FF", // Светло-лавандовый фон из ТЗ
        bgDark: "#0F172A", // Глубокий темный фон (не синий)
        cardLight: "#FFFFFF", // Белые карточки
        cardDark: "#1E293B", // Темно-серые карточки для темной темы
        textMain: "#1E293B", // Основной текст (светлая тема)
        textMainDark: "#F8FAFC", // Основной текст (темная тема)
        textMuted: "#64748B", // Вторичный текст
        textMutedDark: "#94A3B8",
      },
    },
  },
  plugins: [],
};
