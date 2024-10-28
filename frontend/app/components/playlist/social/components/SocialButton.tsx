import { motion } from "framer-motion";

interface SocialButtonProps {
  icon: React.ReactNode;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
}

export function SocialButton({ icon, count, isActive, onClick }: SocialButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
        isActive ? 'text-purple-500' : 'text-gray-500 hover:text-purple-500'
      }`}
    >
      {icon}
      {count !== undefined && <span>{count}</span>}
    </motion.button>
  );
}
