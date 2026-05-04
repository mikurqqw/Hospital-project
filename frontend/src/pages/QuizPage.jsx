import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../api/index";

const questions = [
  {
    id: 1,
    text: "Как часто вы употребляете фастфуд?",
    options: [
      { text: "Каждый день", score: 0 },
      { text: "Пару раз в неделю", score: 1 },
      { text: "Очень редко", score: 2 },
    ],
  },
  {
    id: 2,
    text: "Сколько воды вы пьете в день?",
    options: [
      { text: "Меньше литра", score: 0 },
      { text: "Около 1.5 литров", score: 1 },
      { text: "Более 2 литров", score: 2 },
    ],
  },
  {
    id: 3,
    text: "Как часто вы занимаетесь спортом?",
    options: [
      { text: "Никогда", score: 0 },
      { text: "1-2 раза в неделю", score: 1 },
      { text: "3 и более раз", score: 2 },
    ],
  },
];

const QuizPage = () => {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [aiTip, setAiTip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (optionScore) => {
    setScore(score + optionScore);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz(score + optionScore);
    }
  };

  const finishQuiz = async (finalScore) => {
    setIsFinished(true);
    setIsLoading(true);
    const total = questions.length * 2;
    try {
      const response = await api.post("/quiz/submit", {
        quiz_type: "Образ жизни",
        score: finalScore,
        total,
      });
      setAiTip(response.data.feedback);
    } catch (error) {
      setAiTip(t("quiz.error") || "Ошибка получения совета от ИИ.");
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setIsFinished(false);
    setAiTip(null);
  };

  return (
    <div className="relative min-h-screen py-12 px-4 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-primary/5 z-0 pointer-events-none"></div>

      <motion.div className="max-w-2xl w-full mx-auto relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-gray-800/50 shadow-2xl shadow-black/5 overflow-hidden p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg rotate-3">
            <ClipboardList size={30} />
          </div>
          <h1 className="text-3xl font-black text-textMain dark:text-textMainDark mb-2">
            {t("quiz.title") || "Квиз: Образ жизни"}
          </h1>
          <p className="text-textMuted dark:text-textMutedDark">
            {t("quiz.subtitle") ||
              "Ответьте на пару вопросов и получите персональный ИИ-совет."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-textMuted dark:text-textMutedDark mb-2">
                  <span>
                    {t("quiz.question") || "Вопрос"} {currentQ + 1}{" "}
                    {t("quiz.of") || "из"} {questions.length}
                  </span>
                  <span className="text-primary">
                    {Math.round(((currentQ + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQ + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-textMain dark:text-textMainDark mb-6 text-center">
                {questions[currentQ].text}
              </h3>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.score)}
                    className="w-full py-4 px-6 text-left bg-white dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-200 dark:border-gray-700 hover:border-primary text-textMain dark:text-textMainDark font-medium rounded-2xl transition-all shadow-sm"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-textMain dark:text-textMainDark mb-2">
                {t("quiz.result_title") || "Квиз пройден!"}
              </h2>

              <div className="bg-white/80 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8 mt-6 text-left relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-primary w-5 h-5" />
                  <span className="font-bold text-textMain dark:text-textMainDark">
                    {t("quiz.ai_advice") || "Совет от AI Health:"}
                  </span>
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-full animate-pulse"></div>
                    <div
                      className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-4/5 animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                  </div>
                ) : (
                  <p className="text-textMain dark:text-textMainDark font-medium leading-relaxed whitespace-pre-wrap">
                    {aiTip}
                  </p>
                )}
              </div>

              <button
                onClick={restart}
                className="px-8 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-textMain dark:text-textMainDark rounded-xl font-bold transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw size={18} /> {t("quiz.restart") || "Пройти заново"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default QuizPage;
