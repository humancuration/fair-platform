import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementUnlockProps {
  achievement: Achievement;
  onClose: () => void;
}

const rarityColors = {
  common: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600"
};

const rarityMessages = {
  common: "Nice work bestie! 👏",
  rare: "You're popping off! 💅",
  epic: "Absolutely iconic! ✨",
  legendary: "MAIN CHARACTER ENERGY! 👑"
};

export function AchievementUnlock({ achievement, onClose }: AchievementUnlockProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (achievement.rarity === "legendary") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} p-6 rounded-lg shadow-lg text-white max-w-sm`}>
            <div className="flex items-center gap-4">
              <motion.div
                className="text-4xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {achievement.icon}
              </motion.div>
              
              <div>
                <motion.h3
                  className="text-xl font-bold"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Achievement Unlocked!
                </motion.h3>
                <motion.p
                  className="text-sm opacity-90"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {achievement.title}
                </motion.p>
              </div>
            </div>

            <motion.p
              className="mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.4 }}
            >
              {achievement.description}
            </motion.p>

            <motion.div
              className="mt-3 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {rarityMessages[achievement.rarity]}
            </motion.div>

            <motion.button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
