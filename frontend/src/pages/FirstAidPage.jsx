import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Phone,
  Search,
  Flame,
  Thermometer,
  Bandage,
  Wind,
  Bone,
  Bug,
  EyeOff,
  Skull,
  X,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const FirstAidPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      id: "burns",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      id: "fever",
      icon: Thermometer,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      id: "cuts",
      icon: Bandage,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      id: "choking",
      icon: Wind,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "fractures",
      icon: Bone,
      color: "text-gray-500",
      bg: "bg-gray-50 dark:bg-gray-800",
    },
    {
      id: "allergy",
      icon: Bug,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      id: "fainting",
      icon: EyeOff,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      id: "poisoning",
      icon: Skull,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  const filteredTopics = topics.filter(
    (topic) =>
      t(`firstaid.${topic.id}_title`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      t(`firstaid.${topic.id}_desc`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen px-4 py-12 overflow-hidden">
      {/* Фоновые свечения */}
      <div className="absolute top-[5%] left-[-10%] w-[50%] h-[40%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Экстренный баннер */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-between gap-6 p-6 mb-12 shadow-2xl bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl md:p-8 shadow-red-500/20 md:flex-row"
        >
          <div className="flex items-start gap-4 text-white">
            <div className="flex-shrink-0 p-3 bg-white/20 rounded-2xl animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="mb-1 text-2xl font-black">
                {t("firstaid.emergency_title") || "Экстренная ситуация?"}
              </h2>
              <p className="text-sm text-red-100 md:text-base">
                {t("firstaid.emergency_desc") ||
                  "Сохраняйте спокойствие. Оцените безопасность места происшествия перед тем, как помогать."}
              </p>
            </div>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <a
              href="tel:103"
              className="flex flex-col items-center justify-center flex-1 px-6 py-3 text-white transition-all border md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl border-white/10"
            >
              <span className="text-xs font-bold uppercase opacity-80">
                {t("firstaid.ambulance") || "Скорая"}
              </span>
              <span className="flex items-center gap-2 text-2xl font-black">
                <Phone size={18} /> 103
              </span>
            </a>
            <a
              href="tel:112"
              className="flex flex-col items-center justify-center flex-1 px-6 py-3 text-white transition-all border md:flex-none bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl border-white/10"
            >
              <span className="text-xs font-bold uppercase opacity-80">
                {t("firstaid.rescue") || "МЧС"}
              </span>
              <span className="flex items-center gap-2 text-2xl font-black">
                <Phone size={18} /> 112
              </span>
            </a>
          </div>
        </motion.div>

        {/* Заголовок и поиск */}
        <div className="flex flex-col items-center justify-between gap-6 mb-10 md:flex-row">
          <div>
            <h1 className="mb-2 text-4xl font-black text-textMain dark:text-textMainDark">
              {t("firstaid.title") || "Первая помощь"}
            </h1>
            <p className="text-textMuted dark:text-textMutedDark">
              {t("firstaid.subtitle") ||
                "Быстрые инструкции для экстренных ситуаций."}
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search
              className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                t("firstaid.search_ph") || "Поиск ситуации (например: ожог)..."
              }
              className="w-full py-4 pl-12 pr-4 transition-all border border-gray-200 shadow-sm outline-none bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-red-500 text-textMain dark:text-textMainDark"
            />
          </div>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTopic(topic)}
              className="flex flex-col h-full p-6 transition-all transform border shadow-xl cursor-pointer group bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border-white/40 dark:border-gray-800/50 shadow-black/5 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 ${topic.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <topic.icon className={`w-7 h-7 ${topic.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-bold transition-colors text-textMain dark:text-textMainDark group-hover:text-red-500">
                {t(`firstaid.${topic.id}_title`)}
              </h3>
              <p className="flex-grow text-sm text-textMuted dark:text-textMutedDark">
                {t(`firstaid.${topic.id}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Модальное окно инструкций */}
        <AnimatePresence>
          {selectedTopic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800"
              >
                <div
                  className={`p-6 md:p-8 ${selectedTopic.bg} flex justify-between items-start relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                        <selectedTopic.icon
                          className={`w-6 h-6 ${selectedTopic.color}`}
                        />
                      </div>
                      <h2 className="text-2xl font-black md:text-3xl text-textMain dark:text-textMainDark">
                        {t(`firstaid.${selectedTopic.id}_title`)}
                      </h2>
                    </div>
                    <p className="text-textMuted dark:text-textMutedDark">
                      {t(`firstaid.${selectedTopic.id}_desc`)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="relative z-10 p-2 transition-colors rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40"
                  >
                    <X
                      size={24}
                      className="text-textMain dark:text-textMainDark"
                    />
                  </button>
                  <ShieldAlert
                    className={`absolute -bottom-10 -right-10 w-48 h-48 opacity-10 ${selectedTopic.color}`}
                  />
                </div>

                <div className="p-6 overflow-y-auto md:p-8 custom-scrollbar">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-textMain dark:text-textMainDark">
                    <ArrowRight className="text-red-500" size={20} /> Порядок
                    действий:
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-center w-8 h-8 font-black text-red-600 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-400 shrink-0">
                          {step}
                        </div>
                        <p className="mt-1 font-medium text-textMain dark:text-textMainDark">
                          {t(`firstaid.${selectedTopic.id}_step${step}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default FirstAidPage;
