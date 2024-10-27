import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: "research" | "technical" | "collaboration" | "communication";
  experience: number;
  nextMilestone: number;
  effects: {
    aura: string;
    particles: string;
    sound?: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  dateEarned: string;
  effects: {
    animation: string;
    particles: string[];
    sound?: string;
  };
}

interface AvatarCustomization {
  baseStyle: string;
  accessories: string[];
  effects: {
    aura: string;
    particles: string[];
    animation: string;
  };
  mood: "focused" | "excited" | "curious" | "determined";
}

const skillCategories = {
  research: {
    color: "#4CAF50",
    icon: "🔬",
    effects: ["sparkles", "atoms", "books"]
  },
  technical: {
    color: "#2196F3",
    icon: "💻",
    effects: ["circuits", "code", "gears"]
  },
  collaboration: {
    color: "#9C27B0",
    icon: "🤝",
    effects: ["connections", "hearts", "stars"]
  },
  communication: {
    color: "#FF9800",
    icon: "📢",
    effects: ["waves", "bubbles", "notes"]
  }
};

const rarityColors = {
  common: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-400"
};

export function SkillAvatarEffects() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [avatarMood, setAvatarMood] = useState<AvatarCustomization["mood"]>("focused");
  const fetcher = useFetcher();

  const handleLevelUp = (skillId: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ['#FFD700', '#FFA500', '#FF69B4'],
      shapes: ['star']
    });
    
    // Trigger level up animation and effects
    setActiveEffects(prev => [...prev, "levelUp"]);
    setTimeout(() => {
      setActiveEffects(prev => prev.filter(effect => effect !== "levelUp"));
    }, 2000);

    fetcher.submit(
      { skillId, intent: "levelUp" },
      { method: "post" }
    );
  };

  return (
    <div className="skill-avatar p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Research Avatar ✨
          </h2>
          <p className="text-gray-600 mt-1">Level up your research journey!</p>
        </div>
      </div>

      {/* Avatar Display */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Active Effects */}
        <AnimatePresence>
          {activeEffects.map((effect, index) => (
            <motion.div
              key={`${effect}-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0"
            >
              {/* Effect-specific animations */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(skillCategories).map(([category, info]) => (
          <motion.div
            key={category}
            className="relative p-4 bg-white rounded-xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{info.icon}</span>
              <h3 className="font-medium capitalize">{category}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level 42</span>
                <span>Next: 1000 XP</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: info.color }}
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLevelUp(category)}
              className="mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm w-full hover:bg-gray-200"
            >
              View Skills
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="font-bold mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Prolific Reviewer", "Code Wizard", "Team Player", "Knowledge Seeker"].map((achievement, index) => (
            <motion.div
              key={achievement}
              className={`p-4 rounded-lg bg-gradient-to-br ${
                rarityColors[["common", "rare", "epic", "legendary"][index] as keyof typeof rarityColors]
              } text-white text-center`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-medium">{achievement}</div>
              <div className="text-sm opacity-75">Level {index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">{selectedSkill.name}</h3>
              {/* Skill details would go here */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
