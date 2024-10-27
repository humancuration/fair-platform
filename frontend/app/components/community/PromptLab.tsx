import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Prompt {
  id: string;
  content: string;
  category: "art" | "code" | "writing" | "music" | "ai" | "wild";
  author: {
    username: string;
    avatar: string;
  };
  inspirationCount: number;
  responses: number;
  tags: string[];
}

const categoryEmojis = {
  art: "🎨",
  code: "💻",
  writing: "✍️",
  music: "🎵",
  ai: "🤖",
  wild: "🌈"
};

const funResponses = [
  "This sparked joy! ✨",
  "Mind = blown 🤯",
  "Challenge accepted! 💪",
  "Ooooh, spicy! 🌶️",
  "Now that's thinking outside the box! 📦",
  "My brain is tingling! 🧠",
  "Time to get weird! 👽",
  "Let's gooooo! 🚀"
];

export function PromptLab() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof categoryEmojis>("wild");
  const [isCreating, setIsCreating] = useState(false);
  const fetcher = useFetcher();

  const handleInspired = (promptId: string) => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 }
    });
    fetcher.submit(
      { promptId, intent: "inspired" },
      { method: "post", action: "/api/prompts" }
    );
  };

  return (
    <div className="prompt-lab p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Prompt Lab 🧪
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
        >
          Share a Prompt ✨
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(categoryEmojis).map(([category, emoji]) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category as keyof typeof categoryEmojis)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              activeCategory === category
                ? "bg-white shadow-md"
                : "bg-white/50 hover:bg-white/80"
            }`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="capitalize">{category}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-white rounded-lg shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Create a Prompt</h3>
            <textarea
              placeholder="Share something that inspires you..."
              className="w-full p-3 border rounded-lg mb-4 h-32"
            />
            <div className="flex justify-between items-center">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as keyof typeof categoryEmojis)}
                className="p-2 border rounded"
              >
                {Object.entries(categoryEmojis).map(([category, emoji]) => (
                  <option key={category} value={category}>
                    {emoji} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-500 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle submit
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Share Prompt
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {/* Example prompts - would come from API */}
        {[1, 2, 3].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                <div>
                  <h3 className="font-medium">Creative Username</h3>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-2xl">{categoryEmojis[activeCategory]}</span>
            </div>

            <p className="text-gray-800 mb-4">
              What if you combined the aesthetics of vaporwave with traditional oil painting techniques? 
              Bonus points if you incorporate AI-generated elements! 🎨✨
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {["vaporwave", "painting", "ai-art", "fusion"].map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => handleInspired(`prompt-${i}`)}
                  className="flex items-center gap-1 text-purple-500 hover:text-purple-600"
                >
                  <span className="material-icons">auto_awesome</span>
                  <span>42 inspired</span>
                </button>
                <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                  <span className="material-icons">chat_bubble_outline</span>
                  <span>12 responses</span>
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm"
              >
                Try this prompt!
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
