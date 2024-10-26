import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

interface LoginWithGitHubProps {
  className?: string;
  onLogin?: () => void;
}

export default function LoginWithGitHub({ 
  className = '',
  onLogin 
}: LoginWithGitHubProps) {
  const handleGitHubLogin = () => {
    const apiBaseUrl = window.ENV.API_BASE_URL || 'http://localhost:3000';
    window.location.href = `${apiBaseUrl}/auth/github`;
    onLogin?.();
  };

  return (
    <motion.button
      onClick={handleGitHubLogin}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-3
        w-full px-4 py-2 rounded-md
        bg-gray-800 text-white
        hover:bg-gray-700
        transition-colors
        ${className}
      `}
    >
      <FaGithub className="w-5 h-5" />
      <span>Continue with GitHub</span>
    </motion.button>
  );
}
