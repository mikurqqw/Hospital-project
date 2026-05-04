import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  CalendarHeart,
  HeartPulse,
  ShieldCheck,
  Brain,
  Zap,
  X,
} from "lucide-react";
import { useAppointmentStore } from "../store/appointmentStore";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

// --- СТРАНИЦА "ВРАЧИ" ---
export const DoctorsPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const { bookAppointment, appointments } = useAppointmentStore();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const categories = [
    { id: "all", label: t("doctors.all") || "Все" },
    { id: "therapist", label: t("doctors.therapist") || "Терапевты" },
    { id: "cardiologist", label: t("doctors.cardiologist") || "Кардиологи" },
    { id: "neurologist", label: t("doctors.neurologist") || "Неврологи" },
    { id: "trauma", label: "Травматологи" },
    { id: "ophthalmologist", label: "Офтальмологи" },
    { id: "gastro", label: "Гастроэнтерологи" },
    { id: "sports", label: t("doctors.sports") || "Спортивные врачи" },
  ];

  const doctors = [
    // Терапевты
    {
      id: 1,
      name: "Айгерим Нурланова",
      spec: "Врач-терапевт",
      cat: "therapist",
      exp: "10 лет",
      rating: "4.9",
      img: "https://i.pravatar.cc/150?img=9",
      clinic: "Центральная Клиника",
    },
    {
      id: 2,
      name: "Динара Исаева",
      spec: "Терапевт высшей категории",
      cat: "therapist",
      exp: "20 лет",
      rating: "5.0",
      img: "https://i.pravatar.cc/150?img=20",
      clinic: "Premium Med",
    },
    // Кардиологи
    {
      id: 3,
      name: "Елена Ким",
      spec: "Врач-кардиолог",
      cat: "cardiologist",
      exp: "15 лет",
      rating: "5.0",
      img: "https://i.pravatar.cc/150?img=5",
      clinic: "Cardio Center",
    },
    {
      id: 4,
      name: "Руслан Таиров",
      spec: "Кардиолог, Аритмолог",
      cat: "cardiologist",
      exp: "12 лет",
      rating: "4.8",
      img: "https://i.pravatar.cc/150?img=11",
      clinic: "Городская больница №1",
    },
    // Неврологи
    {
      id: 5,
      name: "Тимур Оспанов",
      spec: "Невролог, Эпилептолог",
      cat: "neurologist",
      exp: "8 лет",
      rating: "4.8",
      img: "https://i.pravatar.cc/150?img=12",
      clinic: "NeuroClinic",
    },
    {
      id: 6,
      name: "Анна Смирнова",
      spec: "Детский невролог",
      cat: "neurologist",
      exp: "14 лет",
      rating: "4.9",
      img: "https://i.pravatar.cc/150?img=24",
      clinic: "NeuroClinic",
    },
    // Травматологи/Ортопеды
    {
      id: 7,
      name: "Марат Сабитов",
      spec: "Хирург-травматолог",
      cat: "trauma",
      exp: "18 лет",
      rating: "4.9",
      img: "https://i.pravatar.cc/150?img=33",
      clinic: "Ortho Med",
    },
    {
      id: 8,
      name: "Олег Петров",
      spec: "Ортопед",
      cat: "trauma",
      exp: "9 лет",
      rating: "4.7",
      img: "https://i.pravatar.cc/150?img=15",
      clinic: "ТравмПункт 24/7",
    },
    // Офтальмологи
    {
      id: 9,
      name: "Зарина Каримова",
      spec: "Офтальмолог-хирург",
      cat: "ophthalmologist",
      exp: "11 лет",
      rating: "5.0",
      img: "https://i.pravatar.cc/150?img=42",
      clinic: "Eye Center",
    },
    {
      id: 10,
      name: "Иван Соколов",
      spec: "Окулист",
      cat: "ophthalmologist",
      exp: "5 лет",
      rating: "4.6",
      img: "https://i.pravatar.cc/150?img=60",
      clinic: "Центральная Клиника",
    },
    // Гастроэнтерологи
    {
      id: 11,
      name: "Асель Бекова",
      spec: "Гастроэнтеролог",
      cat: "gastro",
      exp: "13 лет",
      rating: "4.9",
      img: "https://i.pravatar.cc/150?img=32",
      clinic: "Gastro Health",
    },
    {
      id: 12,
      name: "Денис Юн",
      spec: "Гастроэнтеролог, Диетолог",
      cat: "gastro",
      exp: "7 лет",
      rating: "4.8",
      img: "https://i.pravatar.cc/150?img=68",
      clinic: "Gastro Health",
    },
    // Спортивные
    {
      id: 13,
      name: "Алихан Смаилов",
      spec: "Спортивный врач",
      cat: "sports",
      exp: "12 лет",
      rating: "4.9",
      img: "https://i.pravatar.cc/150?img=61",
      clinic: "Sports Med",
    },
    {
      id: 14,
      name: "Дмитрий Иванов",
      spec: "Спортивный диетолог",
      cat: "sports",
      exp: "7 лет",
      rating: "4.7",
      img: "https://i.pravatar.cc/150?img=14",
      clinic: "FitHealth",
    },
  ];

  const filteredDoctors =
    filter === "all" ? doctors : doctors.filter((d) => d.cat === filter);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!date || !time)
      return toast.error(
        t("doctors.fill_date_time") || "Выберите дату и время",
      );
    bookAppointment(selectedDoctor, date, time);
    toast.success(
      `${t("doctors.success_book") || "Запись подтверждена:"} ${selectedDoctor.name}`,
    );
    setSelectedDoctor(null);
    setDate("");
    setTime("");
  };

  return (
    <div className="relative min-h-screen px-4 py-12 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-black md:text-5xl text-textMain dark:text-textMainDark"
          >
            {t("doctors.title_1") || "Наши"}{" "}
            <span className="text-primary">
              {t("doctors.title_2") || "Специалисты"}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-lg text-textMuted"
          >
            {t("doctors.subtitle") ||
              "Получили анализ ИИ? Выберите профильного врача для точного диагноза."}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === cat.id ? "bg-primary text-white shadow-lg" : "bg-white dark:bg-gray-800 text-textMuted border border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col justify-between p-5 transition-all border border-gray-100 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl dark:border-gray-800 hover:shadow-primary/10"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={doc.img}
                      alt={doc.name}
                      className="object-cover w-16 h-16 shadow-sm rounded-2xl"
                    />
                    <div>
                      <h3 className="text-lg font-bold leading-tight text-textMain dark:text-textMainDark">
                        {doc.name}
                      </h3>
                      <p className="mb-1 text-xs font-medium text-primary">
                        {doc.spec}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {doc.rating}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-textMuted">{doc.exp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 mb-4 text-xs bg-gray-50 dark:bg-black/20 rounded-xl text-textMain dark:text-textMainDark">
                    <MapPin className="w-3 h-3 text-primary" /> {doc.clinic}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  disabled={appointments.some((a) => a.id === doc.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${appointments.some((a) => a.id === doc.id) ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-textMain dark:text-textMainDark"}`}
                >
                  <CalendarHeart className="w-4 h-4" />
                  {appointments.some((a) => a.id === doc.id)
                    ? t("doctors.booked") || "Вы записаны"
                    : t("doctors.book_btn") || "Записаться"}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 rounded-3xl dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-textMain dark:text-textMainDark">
                {t("doctors.modal_title") || "Выберите время"}
              </h3>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-textMain dark:text-textMainDark">
              Врач: <strong>{selectedDoctor.name}</strong>
            </p>
            <form onSubmit={handleBooking} className="space-y-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 outline-none rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary text-textMain dark:text-textMainDark"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 outline-none rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary text-textMain dark:text-textMainDark"
              />
              <button
                type="submit"
                className="w-full py-4 font-bold text-white bg-primary rounded-xl hover:bg-primaryHover"
              >
                {t("doctors.confirm") || "Подтвердить"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- СТРАНИЦА "О НАС" ---
export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-rose-500/5 to-primary/5"></div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mx-auto relative z-10 text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] border border-white/50 dark:border-gray-800/50 shadow-2xl"
      >
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 shadow-xl bg-gradient-to-br from-rose-400 to-primary rounded-3xl rotate-3">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
        <h1 className="mb-6 text-4xl font-black md:text-5xl text-textMain dark:text-textMainDark">
          AI Health: Эволюция заботы о себе
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-textMuted dark:text-textMutedDark">
          Мы — инновационный проект на стыке классической медицины и передовых
          технологий. Наша миссия — дать каждому человеку мгновенный, безопасный
          и приватный доступ к предварительной диагностике с использованием
          локальных нейросетей, которые не отправляют ваши данные в облако.
        </p>
        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="p-6 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-3xl dark:border-gray-800">
            <HeartPulse className="w-8 h-8 mb-4 text-rose-500" />
            <h3 className="mb-2 text-lg font-bold text-textMain dark:text-textMainDark">
              Точность
            </h3>
            <p className="text-sm text-textMuted dark:text-textMutedDark">
              Машинное обучение для анализа симптомов и биометрии.
            </p>
          </div>
          <div className="p-6 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-3xl dark:border-gray-800">
            <Brain className="w-8 h-8 mb-4 text-primary" />
            <h3 className="mb-2 text-lg font-bold text-textMain dark:text-textMainDark">
              Конфиденциальность
            </h3>
            <p className="text-sm text-textMuted dark:text-textMutedDark">
              Нейросети работают локально. Ваши снимки остаются у вас.
            </p>
          </div>
          <div className="p-6 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-3xl dark:border-gray-800">
            <Zap className="w-8 h-8 mb-4 text-amber-500" />
            <h3 className="mb-2 text-lg font-bold text-textMain dark:text-textMainDark">
              Скорость
            </h3>
            <p className="text-sm text-textMuted dark:text-textMutedDark">
              Мгновенный ответ 24/7 в любой экстренной ситуации.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- СТРАНИЦА "КОНТАКТЫ" ---
export const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/50 dark:border-gray-800/50 shadow-2xl p-8 md:p-12"
      >
        <div>
          <h1 className="mb-4 text-4xl font-black text-textMain dark:text-textMainDark">
            Свяжитесь с нами
          </h1>
          <p className="mb-10 text-textMuted dark:text-textMutedDark">
            Остались вопросы по работе алгоритмов или хотите стать
            врачом-партнером? Мы всегда на связи.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-2xl dark:border-gray-800">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-textMuted">Телефон</p>
                <p className="font-medium text-textMain dark:text-textMainDark">
                  +7 (777) 777-77-77
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-2xl dark:border-gray-800">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <Mail className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-textMuted">Email</p>
                <p className="font-medium text-textMain dark:text-textMainDark">
                  support@ai-health.kz
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-100 bg-white/50 dark:bg-black/20 rounded-2xl dark:border-gray-800">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-textMuted">Адрес</p>
                <p className="font-medium text-textMain dark:text-textMainDark">
                  Казахстан, г. Алматы, IT-Парк
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-center">
          <h3 className="mb-4 text-2xl font-bold">Техническая поддержка</h3>
          <p className="mb-8 opacity-80">
            Если нейросеть выдает ошибку, пожалуйста, убедитесь, что приложение
            Ollama запущено в фоновом режиме на вашем устройстве.
          </p>
          <a
            href="mailto:support@ai-health.kz"
            className="py-4 font-bold text-center transition-all bg-white text-primary rounded-xl hover:shadow-lg"
          >
            Написать в поддержку
          </a>
        </div>
      </motion.div>
    </div>
  );
};
