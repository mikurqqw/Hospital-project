import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Activity,
  User,
  Fingerprint,
  CalendarHeart,
  Trash2,
  Ruler,
  Scale,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { saveHealthData, getHealthData } from "../api/health";
import { motion, AnimatePresence } from "framer-motion";
import { useAppointmentStore } from "../store/appointmentStore";
import { useTranslation } from "react-i18next";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [latestData, setLatestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { appointments, cancelAppointment } = useAppointmentStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHealthData();
        if (data && data.length > 0) {
          setLatestData(data[0]);
          reset(data[0]);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age),
      };
      const newRecord = await saveHealthData(payload);
      setLatestData(newRecord);
      toast.success("Данные успешно обновлены!");
    } catch (error) {
      toast.error("Ошибка сохранения");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-primary animate-pulse">
        Загрузка профиля...
      </div>
    );

  return (
    <div className="relative min-h-screen px-4 py-12 overflow-hidden">
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* ХЕДЕР ПРОФИЛЯ */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex items-center gap-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-center w-20 h-20 text-4xl font-black text-white shadow-xl bg-gradient-to-br from-primary to-blue-600 rounded-2xl rotate-3">
            {user?.full_name?.charAt(0)?.toUpperCase() || <User size={40} />}
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-black md:text-4xl text-textMain dark:text-white">
              {t("profile.hello")},{" "}
              <span className="text-primary">
                {user?.full_name || "Спортсмен"}
              </span>
            </h1>
            <div className="flex items-center gap-2 font-medium text-textMuted">
              <Fingerprint size={16} /> <span>{user?.email}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ЛЕВАЯ КОЛОНКА: КОЛЬЦА И ЗАПИСИ */}
          <div className="space-y-8 lg:col-span-1">
            {/* КОЛЬЦА ЗДОРОВЬЯ */}
            <motion.div
              variants={itemVariants}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-xl border border-white/40"
            >
              <h3 className="mb-8 text-xl font-bold text-center">
                Индекс Здоровья
              </h3>
              <div className="flex items-center justify-around mb-8">
                {/* Кольцо ИМТ */}
                <div className="relative flex flex-col items-center">
                  <svg className="transform -rotate-90 w-28 h-28">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-gray-100 dark:text-gray-800"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 301 }}
                      animate={{
                        strokeDashoffset:
                          301 -
                          (301 *
                            (latestData?.bmi
                              ? Math.min((22 / latestData.bmi) * 100, 100)
                              : 0)) /
                            100,
                      }}
                      transition={{ duration: 2, ease: "circOut" }}
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="301"
                      strokeLinecap="round"
                      className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center top-10">
                    <span className="text-2xl font-black">
                      {latestData?.bmi || "0"}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-textMuted mt-3 uppercase tracking-tighter">
                    Ваш ИМТ
                  </p>
                </div>

                {/* Кольцо Активности */}
                <div className="relative flex flex-col items-center">
                  <svg className="transform -rotate-90 w-28 h-28">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-gray-100 dark:text-gray-800"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 301 }}
                      animate={{
                        strokeDashoffset:
                          301 -
                          (301 *
                            (latestData?.activity_level === "high"
                              ? 100
                              : latestData?.activity_level === "medium"
                                ? 65
                                : 35)) /
                            100,
                      }}
                      transition={{ duration: 2, ease: "circOut", delay: 0.3 }}
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="301"
                      strokeLinecap="round"
                      className="text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center top-11">
                    <Activity className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-[10px] font-black text-textMuted mt-3 uppercase tracking-tighter">
                    Активность
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center border border-gray-100 bg-gray-50/50 dark:bg-black/20 rounded-2xl dark:border-gray-800">
                  <p className="text-[10px] font-bold text-textMuted uppercase mb-1">
                    Рост
                  </p>
                  <p className="text-lg font-black">
                    {latestData?.height || "--"} см
                  </p>
                </div>
                <div className="p-4 text-center border border-gray-100 bg-gray-50/50 dark:bg-black/20 rounded-2xl dark:border-gray-800">
                  <p className="text-[10px] font-bold text-textMuted uppercase mb-1">
                    Вес
                  </p>
                  <p className="text-lg font-black">
                    {latestData?.weight || "--"} кг
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ЗАПИСИ К ВРАЧАМ */}
            <motion.div
              variants={itemVariants}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-xl border border-white/40"
            >
              <h3 className="flex items-center gap-2 mb-6 text-xl font-bold">
                <CalendarHeart className="text-rose-500" /> Записи
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {appointments.length === 0 ? (
                  <p className="py-4 italic text-center text-textMuted">
                    Нет активных записей
                  </p>
                ) : (
                  appointments.map((app) => (
                    <div
                      key={app.appointmentId}
                      className="flex items-center justify-between p-4 transition-colors bg-white border border-gray-100 shadow-sm dark:bg-black/20 rounded-2xl dark:border-gray-800 group hover:border-primary/50"
                    >
                      <div>
                        <h4 className="text-sm font-bold">{app.name}</h4>
                        <p className="text-[10px] text-primary font-bold uppercase">
                          {app.date} • {app.time}
                        </p>
                      </div>
                      <button
                        onClick={() => cancelAppointment(app.appointmentId)}
                        className="p-2 text-gray-300 transition-colors hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ФОРМА РЕДАКТИРОВАНИЯ */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-10 rounded-[3rem] shadow-xl border border-white/40"
          >
            <h2 className="flex items-center gap-3 mb-8 text-2xl font-black">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Scale className="text-primary" />
              </div>
              Параметры тела
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Ваш рост (см)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    {...register("height")}
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Ваш вес (кг)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    {...register("weight")}
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Возраст
                  </label>
                  <input
                    type="number"
                    required
                    {...register("age")}
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Вид спорта
                  </label>
                  <input
                    type="text"
                    {...register("sport_type")}
                    placeholder="Напр: Бокс, Бег..."
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Уровень активности
                  </label>
                  <select
                    {...register("activity_level")}
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none appearance-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  >
                    <option value="low">Низкий (Сидячий образ)</option>
                    <option value="medium">Средний (3-4 тренировки)</option>
                    <option value="high">Высокий (Профи)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-sm font-black uppercase text-textMuted">
                    Ваш пол
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-6 py-4 font-bold transition-all bg-white border-2 border-gray-100 outline-none appearance-none rounded-2xl dark:bg-black/40 dark:border-gray-800 focus:border-primary"
                  >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 text-lg font-black text-white transition-all shadow-xl bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-primary/30 disabled:opacity-70"
              >
                {isSubmitting ? "Сохранение..." : "ОБНОВИТЬ ПРОФИЛЬ"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
