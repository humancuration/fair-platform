import { motion } from 'framer-motion';

export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 }
};

export function AnimatedContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`bg-gradient-to-br from-indigo-400 to-purple-500 p-8 rounded-xl shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
