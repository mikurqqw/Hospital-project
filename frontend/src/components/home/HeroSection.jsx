import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Play, CheckCircle2, Calendar } from "lucide-react";
import FloatingDecorations from "./FloatingDecorations";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-16 pb-32 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      <FloatingDecorations />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть: Текст и Кнопки */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-textMain dark:text-textMainDark leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-textMuted dark:text-textMutedDark mb-10 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primaryHover transition-all shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] hover:-translate-y-1">
                {t("hero.book")}
              </button>
              <button className="px-8 py-4 bg-white dark:bg-cardDark text-textMain dark:text-textMainDark border border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-primary">
                  <Play className="w-4 h-4 ml-1" />
                </span>
                {t("hero.watch")}
              </button>
            </div>
          </motion.div>

          {/* Правая часть: Картинка и Плавающие карточки */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-10 mt-10 lg:mt-0"
          >
            {/* Круглый фон под врачом */}
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-full transform scale-110 -z-10"></div>

            {/* Картинка врача */}
            <div className="relative rounded-t-full overflow-hidden border-b-0 border-4 border-white dark:border-cardDark shadow-2xl bg-gradient-to-b from-blue-100 to-white dark:from-slate-800 dark:to-cardDark pt-10 px-4">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop"
                alt="Doctor"
                className="w-full h-auto object-cover object-top drop-shadow-2xl rounded-t-full"
                style={{ maxHeight: "600px" }}
              />
            </div>

            {/* Плавающая карточка 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 -left-12 sm:-left-20 bg-cardLight dark:bg-cardDark p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-textMain dark:text-textMainDark">
                  Well Qualified
                </p>
                <p className="text-xs text-textMuted dark:text-textMutedDark">
                  Treat with care
                </p>
              </div>
            </motion.div>

            {/* Плавающая карточка 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/4 -right-8 sm:-right-12 bg-cardLight dark:bg-cardDark p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-textMain dark:text-textMainDark">
                  Appointment
                </p>
                <p className="text-xs text-textMuted dark:text-textMutedDark">
                  Online booking
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
