import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  trend: number;
  category: "citations" | "engagement" | "implementation" | "social";
  history: Array<{
    date: string;
    value: number;
  }>;
  milestones: Array<{
    value: number;
    label: string;
    achieved: boolean;
  }>;
}

interface ResearchOutput {
  id: string;
  title: string;
  type: "paper" | "dataset" | "code" | "experiment";
  date: string;
  metrics: {
    citations: number;
    downloads: number;
    implementations: number;
    discussions: number;
  };
  reach: {
    academic: number;
    industry: number;
    public: number;
  };
}

const impactCategories = {
  citations: {
    color: "#4CAF50",
    icon: "📚",
    description: "Academic Impact"
  },
  engagement: {
    color: "#2196F3",
    icon: "🤝",
    description: "Community Engagement"
  },
  implementation: {
    color: "#9C27B0",
    icon: "⚙️",
    description: "Practical Applications"
  },
  social: {
    color: "#FF9800",
    icon: "🌍",
    description: "Social Impact"
  }
};

const celebrationMessages = [
  "Your research is making waves! 🌊",
  "Knowledge spreads like wildfire! 🔥",
  "Impact level: Legendary! ⭐",
  "You're changing the game! 🎯",
  "Science but make it viral! 🚀"
];

export function ResearchImpactViz() {
  const [selectedMetric, setSelectedMetric] = useState<ImpactMetric | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [viewMode, setViewMode] = useState<"metrics" | "outputs" | "network">("metrics");
  const fetcher = useFetcher();

  const handleMilestoneAchieved = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ['#4CAF50', '#2196F3', '#9C27B0'],
      shapes: ['circle', 'square'],
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="research-impact p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Research Impact ✨
          </h2>
          <p className="text-gray-600 mt-1">
            {celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]}
          </p>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex gap-2">
          {["metrics", "outputs", "network"].map(mode => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode as typeof viewMode)}
              className={`px-4 py-2 rounded-lg ${
                viewMode === mode
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(impactCategories).map(([category, info]) => (
          <motion.div
            key={category}
            className="bg-white rounded-xl p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{info.icon}</span>
              <div>
                <h3 className="font-bold">{info.description}</h3>
                <p className="text-sm text-gray-600">Score: 85</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current</span>
                <span className="text-green-600">↑ 12%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: info.color }}
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {[1, 2, 3].map(star => (
                  <motion.span
                    key={star}
                    className="text-yellow-400"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-blue-600"
                onClick={() => setSelectedMetric({ id: category } as ImpactMetric)}
              >
                View Details →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Research Outputs */}
      <div className="bg-white rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Top Performing Outputs</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              className="p-4 border rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Research Paper {index + 1}</h4>
                  <p className="text-sm text-gray-600">Published in Nature</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  Trending 🔥
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {["Citations", "Downloads", "Implementations", "Discussions"].map((metric, i) => (
                  <div key={metric}>
                    <p className="text-sm text-gray-600">{metric}</p>
                    <p className="font-bold">{100 - i * 20}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact Timeline */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Impact Timeline</h3>
          <div className="flex gap-2">
            {["week", "month", "year"].map(range => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range as typeof timeRange)}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeRange === range
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-48 relative">
          {/* Timeline visualization would go here */}
          <div className="absolute inset-0 flex items-end">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-500 to-blue-500 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Metric Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Detailed metric analysis would go here */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMetric(null)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg"
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
