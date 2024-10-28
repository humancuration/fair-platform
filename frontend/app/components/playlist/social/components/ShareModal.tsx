import { motion } from "framer-motion";
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";

interface ShareModalProps {
  onClose: () => void;
  onShare: (platform: string) => void;
}

export function ShareModal({ onClose, onShare }: ShareModalProps) {
  const platforms = [
    { id: 'twitter', icon: FaTwitter, label: 'Twitter', color: 'bg-blue-400' },
    { id: 'facebook', icon: FaFacebook, label: 'Facebook', color: 'bg-blue-600' },
    { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'copy', icon: FaLink, label: 'Copy Link', color: 'bg-gray-600' }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   bg-gradient-to-br from-purple-900/90 to-blue-900/90 
                   backdrop-blur-lg rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4">Share Playlist</h3>
        <div className="grid grid-cols-2 gap-4">
          {platforms.map(({ id, icon: Icon, label, color }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onShare(id)}
              className={`flex items-center gap-3 p-3 rounded-lg ${color} text-white`}
            >
              <Icon className="text-xl" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
