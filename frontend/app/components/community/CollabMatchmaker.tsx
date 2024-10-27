import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Skill {
  id: string;
  name: string;
  category: "tech" | "creative" | "business" | "science";
}

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  seekingRoles: string[];
  tags: string[];
  stage: "concept" | "prototype" | "mvp" | "growth";
  equity?: {
    available: number;
    distribution: Record<string, number>;
  };
}

interface MatchProfile {
  userId: string;
  username: string;
  avatar: string;
  skills: Skill[];
  interests: string[];
  projectIdeas: ProjectIdea[];
  seeking: {
    roles: string[];
    skills: string[];
    commitment: "full-time" | "part-time" | "casual";
  };
  availability: "immediately" | "within-month" | "exploring";
}

const roleEmojis: Record<string, string> = {
  "developer": "👩‍💻",
  "designer": "🎨",
  "marketer": "📢",
  "founder": "🚀",
  "researcher": "🔬",
  "product": "💡",
  "data": "📊",
  "ai": "🤖",
  "community": "🌟",
};

export function CollabMatchmaker() {
  const [activeView, setActiveView] = useState<"browse" | "my-profile" | "matches">("browse");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const fetcher = useFetcher();

  const handleMatch = (matchId: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    fetcher.submit(
      { matchId, intent: "connect" },
      { method: "post", action: "/api/collab-matches" }
    );
  };

  return (
    <div className="collab-matchmaker p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Startup Matchmaker ✨
        </h2>
        <div className="flex gap-2">
          {["browse", "my-profile", "matches"].map((view) => (
            <motion.button
              key={view}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`px-4 py-2 rounded-full ${
                activeView === view
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {view.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Match Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
        >
          🔥 Hot Projects
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
        >
          🌱 Early Stage
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
        >
          🤖 AI/ML Focus
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
        >
          🌍 Social Impact
        </motion.button>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                <div>
                  <h3 className="font-bold">Cool Startup Idea {index + 1}</h3>
                  <p className="text-sm text-gray-600">by Founder {index + 1}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                MVP Stage
              </span>
            </div>

            <p className="text-gray-700 mb-4">
              Looking for passionate co-founders to revolutionize the way people collaborate online! 
              AI-powered platform with real-time features.
            </p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Seeking:</h4>
              <div className="flex flex-wrap gap-2">
                {["developer", "designer", "marketer"].map(role => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-white/50 rounded-full text-sm"
                  >
                    {roleEmojis[role]} {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                🤝 Equity Available: 30%
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMatch(`match-${index}`)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium"
              >
                Let's Connect! ✨
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Match Success Modal */}
      <AnimatePresence>
        {selectedMatch && (
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
              <h3 className="text-xl font-bold mb-2">It's a Match! 🎉</h3>
              <p className="text-gray-600 mb-4">
                You've connected with an awesome potential co-founder! Time to build something amazing together.
              </p>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMatch(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Start Chatting
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
