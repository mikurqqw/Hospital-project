import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  Plus,
  X,
  Stethoscope,
  AlertCircle,
  FileDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import html2pdf from "html2pdf.js";
import api from "../api/index";

const SymptomCheckerPage = () => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Расширенный список популярных симптомов для быстрого выбора
  const commonSymptoms = [
    "Головная боль",
    "Температура",
    "Кашель",
    "Слабость",
    "Тошнота",
    "Головокружение",
    "Боль в горле",
    "Боль в груди",
    "Одышка",
    "Насморк",
    "Боль в суставах",
    "Боль в животе",
    "Сыпь",
    "Бессонница",
    "Тревожность",
    "Отек",
    "Онемение",
    "Изжога",
  ];

  const addSymptom = (text) => {
    const val = typeof text === "string" ? text : inputValue;
    if (val.trim() && !symptoms.includes(val.trim().toLowerCase())) {
      setSymptoms([...symptoms, val.trim().toLowerCase()]);
      setInputValue("");
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((s) => s !== symptomToRemove.toLowerCase()));
  };

  const toggleSymptom = (sym) => {
    if (symptoms.includes(sym.toLowerCase())) {
      removeSymptom(sym);
    } else {
      addSymptom(sym);
    }
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await api.post("/symptoms/check", { symptoms });
      setResult(response.data.analysis);
    } catch (error) {
      setResult(
        "⚠️ Ошибка анализа. Убедитесь, что ИИ включен и сервер запущен.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("ai-report");
    const opt = {
      margin: 0.5,
      filename: "AI_Health_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="relative min-h-screen px-4 py-12 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-black md:text-5xl text-textMain dark:text-textMainDark"
          >
            Чекер симптомов
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg text-textMuted"
          >
            Выберите симптомы из списка или введите их вручную, чтобы получить
            предварительный анализ от нейросети.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border-white/40 dark:border-gray-800/50 mb-8"
        >
          {/* Быстрые кнопки выбора */}
          <div className="mb-8">
            <p className="mb-4 text-sm font-bold tracking-wider uppercase text-textMuted">
              Частые симптомы:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {commonSymptoms.map((sym) => {
                const isSelected = symptoms.includes(sym.toLowerCase());
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 transform scale-105"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textMain hover:border-primary/50"
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ручной ввод */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSymptom();
            }}
            className="relative flex items-center mb-8"
          >
            <Activity size={20} className="absolute left-4 text-primary" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Добавить свой симптом вручную..."
              className="w-full py-4 pl-12 pr-16 bg-white border border-gray-200 outline-none dark:bg-gray-800 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary text-textMain dark:text-textMainDark"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primaryHover disabled:opacity-50 transition-all"
            >
              <Plus size={20} />
            </button>
          </form>

          {/* Список выбранных */}
          <div className="p-6 mb-8 border border-gray-100 bg-gray-50/50 dark:bg-black/20 rounded-2xl dark:border-gray-800/50">
            <p className="mb-4 text-xs font-black tracking-widest uppercase text-textMuted">
              Выбрано для анализа:
            </p>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              <AnimatePresence>
                {symptoms.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm italic text-gray-400">
                    <AlertCircle size={16} /> Выберите хотя бы один симптом
                  </p>
                ) : (
                  symptoms.map((symptom) => (
                    <motion.div
                      key={symptom}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold border shadow-sm bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300 rounded-xl border-amber-200 dark:border-amber-800/50"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="p-0.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={analyzeSymptoms}
            disabled={symptoms.length === 0 || isLoading}
            className="flex items-center justify-center w-full gap-3 py-5 text-xl font-black text-white transition-all transform shadow-xl bg-gradient-to-r from-primary to-blue-600 rounded-2xl disabled:opacity-70 shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
          >
            {isLoading ? (
              <span className="animate-pulse">ИИ АНАЛИЗИРУЕТ...</span>
            ) : (
              <>
                <Stethoscope size={24} /> ПОЛУЧИТЬ АНАЛИЗ
              </>
            )}
          </button>
        </motion.div>

        {/* Результат */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 border shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border-amber-500/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-textMain dark:text-textMainDark">
                  <ShieldAlert className="text-amber-500" /> Отчет AI Health
                </h3>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-colors shadow-lg bg-amber-500 rounded-xl hover:bg-amber-600"
                >
                  <FileDown size={18} /> Экспорт PDF
                </button>
              </div>
              <div
                id="ai-report"
                className="p-8 text-lg font-medium leading-relaxed whitespace-pre-wrap border border-gray-100 shadow-inner bg-white/90 dark:bg-gray-800/90 rounded-2xl dark:border-gray-700 text-textMain dark:text-textMainDark"
              >
                <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-black uppercase text-primary">
                    Справка о симптомах
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Заявленные жалобы: <b>{symptoms.join(", ")}</b>
                  </p>
                </div>
                {result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
