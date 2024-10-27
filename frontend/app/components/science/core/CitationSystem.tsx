import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Author {
  id: string;
  name: string;
  avatar: string;
  credentials: string[];
  hIndex: number;
  specialties: string[];
  achievements: {
    type: "publication" | "patent" | "award" | "grant";
    name: string;
    year: number;
    icon: string;
  }[];
  profile: {
    bio: string;
    currentWork: string;
    interests: string[];
    avatar: {
      style: string;
      mood: string;
      accessories: string[];
    };
  };
}

interface Citation {
  id: string;
  paper: {
    title: string;
    doi: string;
    year: number;
    journal?: string;
    conference?: string;
    abstract: string;
    keywords: string[];
  };
  authors: Author[];
  citedBy: number;
  references: string[];
  metrics: {
    downloads: number;
    views: number;
    implementations: number;
  };
  socialContext: {
    discussions: number;
    shares: number;
    bookmarks: number;
  };
}

const funMessages = {
  highImpact: [
    "This paper is serving! 💅",
    "Citation game strong! 📚",
    "The science is sciencing! 🧬",
    "Knowledge bomb incoming! 💣"
  ],
  collaboration: [
    "Dream team alert! 👥",
    "Squad goals fr! 🤝",
    "Power collab! ⚡",
    "The crossover we needed! 🌟"
  ]
};

export function CitationSystem() {
  const [activeView, setActiveView] = useState<"list" | "graph" | "authors">("list");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const fetcher = useFetcher();

  const handleCite = (citationId: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#4CAF50', '#2196F3', '#9C27B0']
    });
    
    fetcher.submit(
      { citationId, intent: "cite" },
      { method: "post" }
    );
  };

  return (
    <div className="citation-system p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Citations & References ✨
          </h2>
          <p className="text-gray-600 mt-1">
            Discover the knowledge network
          </p>
        </div>
        <div className="flex gap-2">
          {["list", "graph", "authors"].map((view) => (
            <motion.button
              key={view}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`px-4 py-2 rounded-full ${
                activeView === view
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Citation Cards */}
      <div className="space-y-6">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Amazing Research Paper {index + 1}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">DOI: 10.1234/example</span>
                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    2023
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCite(`citation-${index}`)}
                className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm"
              >
                Cite This ✨
              </motion.button>
            </div>

            {/* Author Avatars */}
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="relative"
                  onClick={() => setSelectedAuthor({ id: `author-${i}` } as Author)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white" />
                  {/* Achievement badges */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-white">
                    🌟
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-sm text-gray-600">Citations</div>
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1.2k</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Implementations</div>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2">
              {["machine-learning", "neural-networks", "ai"].map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/50 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Author Profile Modal */}
      <AnimatePresence>
        {selectedAuthor && (
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-400 to-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">Dr. Awesome Scientist</h3>
                  <p className="text-gray-600">
                    Making science fun again! 🧬✨
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      h-index: 25
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      500+ citations
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievement Gallery */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {["🏆 Best Paper", "🎓 PhD", "🔬 Patent"].map((achievement, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
                  >
                    <div className="text-2xl mb-2">{achievement.split(" ")[0]}</div>
                    <div className="text-sm font-medium">{achievement.split(" ")[1]}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAuthor(null)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  View Full Profile ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
