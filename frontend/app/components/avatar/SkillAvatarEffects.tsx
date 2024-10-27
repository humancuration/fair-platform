import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface SkillEffect {
  skillId: string;
  skillName: string;
  level: number;
  avatarEffects: {
    aura?: string;
    accessories?: string[];
    specialAnimation?: string;
    petBonus?: string;
    emoteUnlocks?: string[];
  };
}

interface SkillAvatarEffectsProps {
  effects: SkillEffect[];
  onApplyEffect: (effectId: string) => void;
}

const effectDescriptions = {
  aura: {
    "mystic": "A shimmering mystical aura ✨",
    "tech": "Digital particle effects 💻",
    "nature": "Floating leaves and flowers 🌿",
    "creative": "Rainbow sparkles and stars 🎨",
    "wisdom": "Ancient runes and symbols 📚"
  },
  specialAnimation: {
    "teleport": "Magical teleport entrance 🌟",
    "glitch": "Matrix-style glitch effect 👾",
    "float": "Levitation and gentle floating 🎈",
    "sparkle": "Continuous sparkle trail ⭐",
    "rainbow": "Rainbow trail when moving 🌈"
  }
};

const funMessages = [
  "Level up your look! ✨",
  "Time to flex those skills! 💪",
  "Your vibe just got upgraded! 🌟",
  "Looking extra iconic today! 👑",
  "Main character energy intensifies! 💫"
];

export function SkillAvatarEffects({ effects, onApplyEffect }: SkillAvatarEffectsProps) {
  const [selectedEffect, setSelectedEffect] = useState<SkillEffect | null>(null);
  const [message] = useState(() => 
    funMessages[Math.floor(Math.random() * funMessages.length)]
  );
  const fetcher = useFetcher();

  const handleApplyEffect = (effect: SkillEffect) => {
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#FFD700', '#FFA500', '#FF69B4']
    });
    onApplyEffect(effect.skillId);
    setSelectedEffect(null);
  };

  return (
    <div className="skill-avatar-effects p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Skill Effects
          </h2>
          <p className="text-gray-600 mt-1">{message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((effect) => (
          <motion.div
            key={effect.skillId}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{effect.skillName}</h3>
                <p className="text-sm text-gray-600">Level {effect.level}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedEffect(effect)}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm"
              >
                Preview ✨
              </motion.button>
            </div>

            <div className="space-y-2">
              {effect.avatarEffects.aura && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌟</span>
                  <span className="text-sm">
                    {effectDescriptions.aura[effect.avatarEffects.aura as keyof typeof effectDescriptions.aura]}
                  </span>
                </div>
              )}

              {effect.avatarEffects.specialAnimation && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span className="text-sm">
                    {effectDescriptions.specialAnimation[effect.avatarEffects.specialAnimation as keyof typeof effectDescriptions.specialAnimation]}
                  </span>
                </div>
              )}

              {effect.avatarEffects.accessories?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <span className="text-sm">
                    Unlocks {effect.avatarEffects.accessories.length} special accessories
                  </span>
                </div>
              )}

              {effect.avatarEffects.petBonus && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🐾</span>
                  <span className="text-sm">
                    {effect.avatarEffects.petBonus}
                  </span>
                </div>
              )}

              {effect.avatarEffects.emoteUnlocks && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {effect.avatarEffects.emoteUnlocks.map((emote) => (
                    <span
                      key={emote}
                      className="px-2 py-1 bg-white/50 rounded-full text-sm"
                    >
                      {emote}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Effect Preview Modal */}
      <AnimatePresence>
        {selectedEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedEffect(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Preview: {selectedEffect.skillName} Effects
              </h3>

              <div className="relative w-full h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4">
                {/* Avatar preview with effects would go here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">🧙‍♂️</span>
                </div>
                
                {/* Example effect visualization */}
                {selectedEffect.avatarEffects.aura && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg" />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedEffect(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApplyEffect(selectedEffect)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Apply Effect ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
