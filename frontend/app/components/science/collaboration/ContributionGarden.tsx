import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Plant {
  id: string;
  type: "seed" | "sprout" | "sapling" | "tree" | "flower" | "fruit";
  name: string;
  growth: number;
  contributions: number;
  lastWatered: string;
  nutrients: {
    collaboration: number;
    creativity: number;
    knowledge: number;
  };
  effects: {
    butterflies?: boolean;
    rainbows?: boolean;
    sparkles?: boolean;
  };
}

const plantEmojis = {
  seed: "🌱",
  sprout: "🌿",
  sapling: "🌳",
  tree: "🎄",
  flower: "🌸",
  fruit: "🍎"
};

const gardenVibes = [
  "Your garden is thriving bestie! ✨",
  "Look at you growing! 🌱",
  "The vibes are immaculate! 🌈",
  "Your garden brings me joy! 🦋",
  "Nature is healing! 🍃",
  "It's giving ecosystem! 🌺",
  "Garden goals fr fr! 🌿",
  "Touch grass (affectionate) 🌱"
];

export function ContributionGarden() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);
  const [gardenMood] = useState(() => 
    gardenVibes[Math.floor(Math.random() * gardenVibes.length)]
  );
  const fetcher = useFetcher();

  // Simulate gentle breeze animation
  useEffect(() => {
    const interval = setInterval(() => {
      const plants = document.querySelectorAll('.plant');
      plants.forEach((plant) => {
        const randomDelay = Math.random() * 2;
        (plant as HTMLElement).style.animationDelay = `${randomDelay}s`;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleWater = (plantId: string) => {
    confetti({
      particleCount: 30,
      spread: 40,
      colors: ['#60A5FA', '#3B82F6', '#2563EB'],
      gravity: 0.5,
      origin: { y: 0.7 }
    });
    
    fetcher.submit(
      { plantId, intent: "water" },
      { method: "post", action: "/api/garden" }
    );
  };

  return (
    <div className="contribution-garden p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Your Contribution Garden 🌿
          </h2>
          <p className="text-gray-600 mt-1">{gardenMood}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlanting(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg"
        >
          Plant Something New ✨
        </motion.button>
      </motion.div>

      {/* Garden Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-6 bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50" />

            {/* Plant content */}
            <div className="relative">
              <motion.div
                className="plant text-6xl mb-4"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {plantEmojis.tree}
              </motion.div>

              <h3 className="font-bold text-lg mb-2">Contribution Tree {index + 1}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Growth</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {["collaboration", "creativity", "knowledge"].map(nutrient => (
                  <span
                    key={nutrient}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                  >
                    {nutrient}: 8/10
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Last watered: 2 hours ago
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWater(`plant-${index}`)}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  Water Plant 💧
                </motion.button>
              </div>
            </div>

            {/* Ambient effects */}
            <AnimatePresence>
              {Math.random() > 0.5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4"
                >
                  <span className="text-2xl">🦋</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Planting Modal */}
      <AnimatePresence>
        {isPlanting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Plant Something New 🌱</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you growing?
                  </label>
                  <input
                    type="text"
                    placeholder="Name your plant..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plant Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(plantEmojis).map(([type, emoji]) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-50 rounded-lg text-center hover:bg-gray-100"
                      >
                        <span className="text-2xl block mb-1">{emoji}</span>
                        <span className="text-sm capitalize">{type}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsPlanting(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Handle planting
                    setIsPlanting(false);
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      colors: ['#84CC16', '#22C55E', '#10B981']
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg"
                >
                  Plant! 🌱
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
