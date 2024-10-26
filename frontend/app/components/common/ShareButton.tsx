import { motion } from 'framer-motion';
import { FaShare } from 'react-icons/fa';

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
  onShare?: () => void;
}

export default function ShareButton({ 
  url, 
  title,
  className = '',
  onShare 
}: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
          text: `Check out ${title}`,
        });
      } else {
        // Fallback to ActivityPub share
        // Implement ActivityPub sharing logic here
        console.log('ActivityPub sharing not implemented yet');
      }
      onShare?.();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-md
        bg-blue-500 text-white
        hover:bg-blue-600
        transition-colors
        ${className}
      `}
    >
      <FaShare className="w-4 h-4" />
      Share to Fediverse
    </motion.button>
  );
}
