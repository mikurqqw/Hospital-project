import { useState } from "react";
import { Upload, FileImage, AlertCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/index";

const DiagnosticsPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Запрос к локальной модели LLaVA
      const response = await api.post("/diagnostics/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.analysis);
    } catch (error) {
      console.error(error);
      setResult("Ошибка анализа. Убедитесь, что ИИ-модуль запущен.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-4 overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-textMain dark:text-textMainDark mb-4"
          >
            AI <span className="text-primary">Диагностика</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-textMuted dark:text-textMutedDark max-w-2xl mx-auto"
          >
            Загрузите рентгеновский снимок или МРТ. Наша локальная нейросеть
            проанализирует изображение за несколько секунд.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Блок загрузки */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 dark:border-gray-800/50 shadow-xl"
          >
            <h3 className="text-xl font-bold text-textMain dark:text-textMainDark mb-6 flex items-center gap-2">
              <FileImage className="text-primary" /> Выбор файла
            </h3>

            {!preview ? (
              <label className="border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <span className="font-bold text-textMain dark:text-textMainDark">
                  Нажмите для загрузки
                </span>
                <span className="text-sm text-textMuted dark:text-textMutedDark mt-2">
                  JPG, PNG (до 10MB)
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-black">
                  <img
                    src={preview}
                    alt="Preview"
                    className={`w-full h-64 object-contain ${isLoading ? "opacity-50" : "opacity-100"}`}
                  />

                  {/* АНИМАЦИЯ ЛАЗЕРНОГО СКАНЕРА */}
                  {isLoading && (
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-textMain dark:text-textMainDark rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Сбросить
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primaryHover shadow-lg shadow-primary/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isLoading ? "Анализируем..." : "Сканировать"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Блок результата */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 dark:border-gray-800/50 shadow-xl flex flex-col"
          >
            <h3 className="text-xl font-bold text-textMain dark:text-textMainDark mb-6 flex items-center gap-2">
              <ShieldCheck className="text-green-500" /> Результат ИИ
            </h3>

            <div className="flex-1 bg-gray-50/50 dark:bg-black/20 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-textMuted dark:text-textMutedDark space-y-4"
                  >
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="font-medium animate-pulse">
                      LLaVA обрабатывает изображение...
                    </p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-textMain dark:text-textMainDark whitespace-pre-wrap leading-relaxed font-medium"
                  >
                    {result}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-textMuted dark:text-textMutedDark"
                  >
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p>Загрузите снимок и нажмите "Сканировать"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default DiagnosticsPage;
