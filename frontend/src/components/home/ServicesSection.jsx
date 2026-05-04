import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  HeartPulse,
  Stethoscope,
  MessageSquare,
  PlusSquare,
  HelpCircle,
} from "lucide-react";

const ServicesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      path: "/diagnostics",
      icon: Stethoscope,
      title: t("services.diag_title"),
      desc: t("services.diag_desc"),
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      id: 2,
      path: "/health-analysis",
      icon: HeartPulse,
      title: t("services.health_title"),
      desc: t("services.health_desc"),
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      id: 3,
      path: "/symptoms",
      icon: Activity,
      title: t("services.symptoms_title"),
      desc: t("services.symptoms_desc"),
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      id: 4,
      path: "/chat",
      icon: MessageSquare,
      title: t("services.chat_title"),
      desc: t("services.chat_desc"),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: 5,
      path: "/first-aid",
      icon: PlusSquare,
      title: t("services.firstaid_title"),
      desc: t("services.firstaid_desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      id: 6,
      path: "/quiz",
      icon: HelpCircle,
      title: t("services.quiz_title"),
      desc: t("services.quiz_desc"),
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <section id="services" className="py-24 bg-transparent scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-textMain dark:text-textMainDark mb-4"
          >
            {t("services.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-textMuted dark:text-textMutedDark"
          >
            {t("services.subtitle")}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              onClick={() => navigate(service.path)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-cardLight dark:bg-cardDark rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className={`w-7 h-7 ${service.color}`} />
              </div>
              <h3 className="text-xl font-bold text-textMain dark:text-textMainDark mb-3">
                {service.title}
              </h3>
              <p className="text-textMuted dark:text-textMutedDark leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesSection;
