import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, UserPlus, Award, Smile } from "lucide-react";

const StatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      id: 1,
      icon: Users,
      value: "10K+",
      label: t("stats.patients"),
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 2,
      icon: UserPlus,
      value: "50+",
      label: t("stats.doctors"),
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 3,
      icon: Award,
      value: "15+",
      label: t("stats.specialties"),
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 4,
      icon: Smile,
      value: "99%",
      label: t("stats.satisfaction"),
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <section className="py-12 relative z-20 -mt-10 sm:-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-cardLight dark:bg-cardDark rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-4`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-extrabold text-textMain dark:text-textMainDark mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-textMuted dark:text-textMutedDark">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
