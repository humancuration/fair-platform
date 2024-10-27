import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import type { Challenge } from "~/types/community";

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => void;
}

const progressEmojis = ["🌱", "🌿", "🌳", "✨"];

export function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onComplete(challenge.id);
  };

  const progressEmoji = progressEmojis[
    Math.floor((challenge.progress / challenge.goal) * (progressEmojis.length - 1))
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden"
    >
      {/* Background pattern */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? 5 : 0,
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{challenge.title}</h3>
            <p className="text-gray-600 mt-1">{challenge.description}</p>
          </div>
          <span className="text-3xl">{progressEmoji}</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{challenge.progress} / {challenge.goal}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(challenge.progress / challenge.goal) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {challenge.progress >= challenge.goal && !challenge.completed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
            >
              Claim Reward ✨
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
