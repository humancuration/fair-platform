import { motion } from "framer-motion";

interface CuratorGridProps {
  children: React.ReactNode;
}

export function CuratorGrid({ children }: CuratorGridProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
