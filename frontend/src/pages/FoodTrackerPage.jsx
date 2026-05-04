import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Utensils, Zap, ShieldCheck, Loader2 } from "lucide-react";
import api from "../api/index";

const FoodTrackerPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAnalysis(null);
    }
  };

  const analyzeFood = async () => {
    if (!image) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      // Используем тот же эндпоинт диагностики, но с другим промптом внутри
      const response = await api.post("/diagnostics/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      setAnalysis("Ошибка анализа еды. Проверьте Ollama.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-12">
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10"
          >
            <Utensils className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="mb-4 text-4xl font-black">AI Food Tracker</h1>
          <p className="text-lg text-textMuted">
            Сфотографируйте ваше блюдо, и ИИ рассчитает калории и БЖУ.
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/40 shadow-2xl">
          <div className="flex flex-col items-center">
            {preview ? (
              <div className="relative w-full max-w-md mb-8 overflow-hidden border-4 border-white shadow-xl aspect-square rounded-3xl">
                <img
                  src={preview}
                  alt="Food"
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => setPreview(null)}
                  className="absolute p-2 text-white rounded-full top-4 right-4 bg-black/50"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md mb-8 transition-colors border-4 border-gray-200 border-dashed cursor-pointer aspect-square rounded-3xl dark:border-gray-800 hover:bg-gray-50">
                <Camera className="w-16 h-16 mb-4 text-gray-300" />
                <span className="font-bold text-textMuted">
                  Загрузить фото обеда
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}

            <button
              onClick={analyzeFood}
              disabled={!image || isLoading}
              className="flex items-center justify-center w-full max-w-md gap-3 py-5 text-xl font-black text-white shadow-xl bg-primary rounded-2xl shadow-primary/30 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "АНАЛИЗИРОВАТЬ СОСТАВ"
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white/80 dark:bg-gray-900/80 p-8 rounded-[2.5rem] border border-primary/20 shadow-xl"
            >
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <Zap className="text-amber-500" /> Состав блюда:
              </h3>
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default FoodTrackerPage;
