import { motion } from "framer-motion";

const FloatingDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Большой синий круг (сфера) слева вверху */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/30 to-blue-300/10 rounded-full blur-2xl"
      />

      {/* Маленькая "пилюля" справа вверху */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [45, 60, 45],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-16 h-32 bg-gradient-to-tr from-purple-400/20 to-primary/20 rounded-full blur-xl transform rotate-45"
      />

      {/* Средний круг внизу */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 left-1/2 w-64 h-64 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
};

export default FloatingDecorations;
