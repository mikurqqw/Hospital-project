import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, ShieldCheck, Zap, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServicesSection from "../components/home/ServicesSection";

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          y: [0, -40, 0],
          rotate: [0, 20, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-64 h-64 bg-gradient-to-br from-blue-400 to-primary rounded-full blur-[80px] opacity-20 dark:opacity-30"
      />
      <motion.div
        animate={{ y: [0, 50, 0], x: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-60 right-[10%] w-72 h-72 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full blur-[90px] opacity-10 dark:opacity-20"
      />
      <motion.div
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-[20%] opacity-20 dark:opacity-30"
      >
        <div className="relative w-24 h-24">
          <div className="absolute top-0 w-4 h-24 rounded-full left-10 bg-gradient-to-t from-emerald-400 to-emerald-600 blur-sm"></div>
          <div className="absolute left-0 w-24 h-4 rounded-full top-10 bg-gradient-to-r from-emerald-400 to-emerald-600 blur-sm"></div>
        </div>
      </motion.div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <FloatingElements />

      <section className="relative z-10 pt-20 pb-20 overflow-hidden lg:pt-32 lg:pb-28">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-primary font-bold text-sm mb-8 border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-xl shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t("home.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl text-textMain dark:text-textMainDark"
          >
            {t("home.title_1")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500 drop-shadow-sm">
              {t("home.title_2")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-4 mb-12 text-xl font-medium text-textMuted dark:text-textMutedDark"
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col justify-center gap-5 sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all rounded-full shadow-xl bg-gradient-to-r from-primary to-blue-600 shadow-primary/30"
            >
              {t("home.btn_ai")} <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/health-analysis")}
              className="flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold transition-all border border-gray-200 rounded-full bg-white/80 dark:bg-gray-800/80 text-textMain dark:text-textMainDark dark:border-gray-700 hover:border-primary/50 hover:shadow-xl backdrop-blur-xl"
            >
              {t("home.btn_body")}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid max-w-5xl grid-cols-1 gap-6 mx-auto mt-24 md:grid-cols-3"
          >
            {[
              {
                icon: ShieldCheck,
                color: "green",
                title: "Конфиденциально",
                desc: "Локальная нейросеть бережет ваши данные",
              },
              {
                icon: Zap,
                color: "blue",
                title: "Мгновенно",
                desc: "Ответы и расшифровки за секунды",
              },
              {
                icon: HeartPulse,
                color: "rose",
                title: "Персонализировано",
                desc: "Адаптация под ваш спорт и вес",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/50 dark:border-gray-800/50 shadow-xl shadow-black/5 flex flex-col items-center"
              >
                <div
                  className={`bg-${feature.color}-100 dark:bg-${feature.color}-900/30 p-4 rounded-2xl mb-5`}
                >
                  <feature.icon
                    className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`}
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold text-textMain dark:text-textMainDark">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium text-center text-textMuted dark:text-textMutedDark">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div
        id="services"
        className="relative z-10 border-t bg-white/40 dark:bg-black/20 backdrop-blur-3xl border-gray-200/50 dark:border-gray-800/50"
      >
        <ServicesSection />
      </div>
    </div>
  );
};

export default HomePage;
