import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Flame,
  HeartPulse,
  Dumbbell,
  AlertTriangle,
} from "lucide-react";
import { getHealthData } from "../api/health";
import { Link } from "react-router-dom";

// Настройки анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const HealthAnalysisPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [goal, setGoal] = useState("maintain");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await getHealthData();
        if (isMounted && data && data.length > 0) setProfileData(data[0]);
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 5000);
    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-textMuted dark:text-textMutedDark font-medium animate-pulse">
          Анализ данных профиля...
        </p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-32 text-center relative z-10"
      >
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
          <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-4xl font-black text-textMain dark:text-textMainDark mb-4">
            Ждем ваших данных
          </h1>
          <p className="text-lg text-textMuted dark:text-textMutedDark mb-10">
            Искусственный интеллект готов рассчитать ваши идеальные параметры.
            Заполните профиль, чтобы начать.
          </p>
          <Link
            to="/profile"
            className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primaryHover hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
          >
            Настроить профиль
          </Link>
        </div>
      </motion.div>
    );
  }

  const { weight, height, age, gender, activity_level, sport_type } =
    profileData;
  const bmr =
    10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
  const multipliers = { low: 1.2, medium: 1.55, high: 1.725 };
  let baseTdee = bmr * (multipliers[activity_level] || 1.2);
  let sportBonus = sport_type && sport_type.trim().length > 0 ? 400 : 0;
  let maintenanceCalories = baseTdee + sportBonus;

  let finalCalories = maintenanceCalories;
  let macros = { p: 0, f: 0, c: 0 };

  if (goal === "cut") {
    finalCalories -= 500;
    macros = { p: 40, f: 30, c: 30 };
  } else if (goal === "bulk") {
    finalCalories += 400;
    macros = { p: 25, f: 25, c: 50 };
  } else {
    macros = { p: 30, f: 30, c: 40 };
  }

  finalCalories = Math.round(finalCalories);
  const waterNorm = Math.round(weight * 30);

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      {/* Фоновые абстракции */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/5"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-rose-500/10 blur-[100px] dark:bg-rose-500/5"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        {/* Шапка */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-gray-800/50 shadow-sm"
        >
          <div>
            <h1 className="text-4xl font-black text-textMain dark:text-textMainDark mb-2 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rose-400 to-primary rounded-2xl text-white shadow-lg">
                <HeartPulse className="w-8 h-8" />
              </div>
              Биометрия тела
            </h1>
            <p className="text-textMuted dark:text-textMutedDark text-lg ml-2">
              Анализ под спорт:{" "}
              <span className="font-bold text-primary">
                {sport_type || "не указан"}
              </span>
            </p>
          </div>

          {/* Анимированный селектор цели */}
          <div className="bg-gray-100/50 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-gray-200/50 dark:border-gray-800/50 relative">
            {["cut", "maintain", "bulk"].map((t) => (
              <button
                key={t}
                onClick={() => setGoal(t)}
                className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all z-10 ${goal === t ? "text-white" : "text-textMuted dark:text-textMutedDark hover:text-textMain dark:hover:text-textMainDark"}`}
              >
                {goal === t && (
                  <motion.div
                    layoutId="activeGoal"
                    className="absolute inset-0 bg-primary rounded-xl shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {t === "cut" ? "Сушка" : t === "maintain" ? "Баланс" : "Набор"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Карточки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-orange-400 to-rose-500 rounded-3xl p-8 text-white shadow-2xl shadow-orange-500/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold">Калории</h3>
              <Flame className="w-10 h-10 text-white/80" />
            </div>
            <p className="text-5xl font-black mb-4 relative z-10">
              {finalCalories}{" "}
              <span className="text-xl font-medium opacity-80">ккал</span>
            </p>
            <div className="space-y-2 bg-black/10 backdrop-blur-sm p-4 rounded-2xl relative z-10">
              <div className="flex justify-between">
                <span className="opacity-80">База:</span>
                <span className="font-bold">{Math.round(bmr)}</span>
              </div>
              {sportBonus > 0 && (
                <div className="flex justify-between text-yellow-200">
                  <span className="opacity-80">Тренировки:</span>
                  <span className="font-bold">+{sportBonus}</span>
                </div>
              )}
              {goal === "cut" && (
                <div className="flex justify-between text-rose-200">
                  <span className="opacity-80">Дефицит:</span>
                  <span className="font-bold">-500</span>
                </div>
              )}
              {goal === "bulk" && (
                <div className="flex justify-between text-green-200">
                  <span className="opacity-80">Профицит:</span>
                  <span className="font-bold">+400</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="text-2xl font-bold">Гидратация</h3>
              <Activity className="w-10 h-10 text-white/80" />
            </div>
            <p className="text-5xl font-black mb-4 relative z-10">
              {waterNorm}{" "}
              <span className="text-xl font-medium opacity-80">мл</span>
            </p>
            <div className="bg-black/10 backdrop-blur-sm p-4 rounded-2xl relative z-10 text-sm leading-relaxed">
              Ваша базовая норма. В дни тяжелых тренировок добавляйте{" "}
              <strong>500-800 мл</strong> электролитов.
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 dark:border-gray-800/50 shadow-xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-2xl font-bold text-textMain dark:text-textMainDark">
                Макронутриенты
              </h3>
              <div className="p-2 bg-primary/10 rounded-xl">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-6">
              {[
                {
                  label: "Белки",
                  percent: macros.p,
                  color: "bg-blue-500",
                  grams: Math.round((finalCalories * (macros.p / 100)) / 4),
                },
                {
                  label: "Жиры",
                  percent: macros.f,
                  color: "bg-amber-500",
                  grams: Math.round((finalCalories * (macros.f / 100)) / 9),
                },
                {
                  label: "Углеводы",
                  percent: macros.c,
                  color: "bg-emerald-500",
                  grams: Math.round((finalCalories * (macros.c / 100)) / 4),
                },
              ].map((macro, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-textMuted dark:text-textMutedDark">
                      {macro.label} ({macro.percent}%)
                    </span>
                    <span className="text-textMain dark:text-textMainDark font-bold">
                      {macro.grams} г
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${macro.percent}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + idx * 0.2,
                        ease: "easeOut",
                      }}
                      className={`${macro.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
export default HealthAnalysisPage;
