import { motion } from "framer-motion";
import { useState } from "react";
import type { ImpactArea } from "~/types/community";

interface ImpactBadgeProps {
  area: ImpactArea;
  index: number;
}

const emojis = ["✨", "🚀", "💫", "🌟", "💅", "💖", "✌️", "🎯"];

export function ImpactBadge({ area, index }: ImpactBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [emoji, setEmoji] = useState(() => 
    emojis[Math.floor(Math.random() * emojis.length)]
  );

  const handleHover = () => {
    setIsHovered(true);
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        rotate: [-1, 1, -1, 0],
        transition: { duration: 0.2 }
      }}
      onHoverStart={handleHover}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-4 text-white shadow-lg"
    >
      {/* Floating emoji */}
      <motion.span
        key={emoji}
        initial={{ opacity: 0, y: 20 }}
        animate={isHovered ? { 
          opacity: [0, 1, 0],
          y: [-20, -40],
          scale: [1, 1.5, 0.8],
          transition: { duration: 0.8 }
        } : {}}
        className="absolute right-2 top-2 text-2xl pointer-events-none"
      >
        {emoji}
      </motion.span>

      {/* Sparkle effect on hover */}
      {isHovered && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white opacity-10 rounded-full"
          style={{ 
            transformOrigin: "center",
          }}
        />
      )}

      <div className="relative z-10">
        <div className="text-3xl mb-2">{area.icon}</div>
        <h3 className="font-bold text-lg mb-1">{area.title}</h3>
        <p className="text-sm opacity-90">{area.description}</p>
        <div className="mt-2 font-mono text-xl">
          {area.count.toLocaleString()}
        </div>
      </div>

      {/* Fun achievement messages on hover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isHovered ? { opacity: 1, y: 0 } : {}}
        className="absolute bottom-2 right-2 text-xs font-bold bg-white/20 px-2 py-1 rounded-full"
      >
        {area.count > 50 ? "Absolutely slaying! 👑" :
         area.count > 20 ? "On fire rn! 🔥" :
         "Just getting started! 🌱"}
      </motion.div>
    </motion.div>
  );
}
