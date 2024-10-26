import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { FaShare, FaCopy, FaCheck } from 'react-icons/fa';
import Button from '../common/Button';

interface ShareWishlistButtonProps {
  username: string;
  onShare?: () => void;
}

export default function ShareWishlistButton({ username, onShare }: ShareWishlistButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/wishlist/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.();
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setShowTooltip(!showTooltip)}
          className="flex items-center gap-2"
          variant="secondary"
        >
          <FaShare className="w-4 h-4" />
          Share Wishlist
        </Button>
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10 w-72"
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded"
              />
              <button
                onClick={handleCopy}
                className="p-2 text-blue-500 hover:text-blue-600"
              >
                {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share this link with others to show them your wishlist!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
