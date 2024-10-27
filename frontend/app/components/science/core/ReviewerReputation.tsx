import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

interface ReviewerStats {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  expertise: string[];
  stats: {
    totalReviews: number;
    acceptedReviews: number;
    averageQuality: number;
    responseTime: number; // in hours
    specializations: Array<{
      field: string;
      reviews: number;
      rating: number;
    }>;
    badges: Array<{
      id: string;
      name: string;
      icon: string;
      description: string;
      rarity: "common" | "rare" | "epic" | "legendary";
    }>;
  };
  recentActivity: Array<{
    type: "review" | "verification" | "mentorship";
    date: string;
    impact: number;
  }>;
}

const fieldEmojis: Record<string, string> = {
  "computer-science": "💻",
  "biology": "🧬",
  "physics": "⚀",
  "chemistry": "⚗️",
  "mathematics": "📐",
  "social-science": "🤝",
  "environmental": "🌍",
  "medicine": "🏥",
  "engineering": "⚙️",
  "ai": "🤖"
};

const badgeColors = {
  common: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-400"
};

export function ReviewerReputation() {
  const [activeTab, setActiveTab] = useState<"overview" | "specializations" | "badges">("overview");
  const [selectedBadge, setSelectedBadge] = useState<ReviewerStats["stats"]["badges"][0] | null>(null);
  const fetcher = useFetcher<ReviewerStats>();

  return (
    <div className="reviewer-reputation p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Reviewer Profile ✨
          </h2>
          <p className="text-gray-600 mt-1">
            Your scientific review impact and expertise
          </p>
        </div>
        <div className="flex gap-2">
          {["overview", "specializations", "badges"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
              <p className="text-3xl font-bold mt-1">247</p>
              <div className="mt-2 text-sm text-green-600">
                ↑ 12% this month
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Acceptance Rate</h3>
              <p className="text-3xl font-bold mt-1">94%</p>
              <div className="mt-2 text-sm text-blue-600">
                Top 5% of reviewers
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Avg. Quality Score</h3>
              <p className="text-3xl font-bold mt-1">4.8/5</p>
              <div className="mt-2 text-sm text-purple-600">
                "Exceptional detail"
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Response Time</h3>
              <p className="text-3xl font-bold mt-1">48h</p>
              <div className="mt-2 text-sm text-indigo-600">
                Faster than average
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "specializations" && (
          <motion.div
            key="specializations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {Object.entries(fieldEmojis).map(([field, emoji]) => (
              <motion.div
                key={field}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{emoji}</span>
                  <h3 className="font-medium capitalize">
                    {field.replace("-", " ")}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expertise Level</span>
                      <span>Expert</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Reviews: 42</span>
                    <span>Rating: 4.9/5</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {/* Example badges */}
            {["Thorough Reviewer", "Quick Responder", "Field Expert", "Mentor"].map((badge, index) => (
              <motion.button
                key={badge}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedBadge({
                  id: `badge-${index}`,
                  name: badge,
                  icon: "🏆",
                  description: "Awarded for exceptional contributions",
                  rarity: ["common", "rare", "epic", "legendary"][index % 4] as any
                })}
                className={`p-4 bg-gradient-to-br ${
                  badgeColors[["common", "rare", "epic", "legendary"][index % 4] as keyof typeof badgeColors]
                } text-white rounded-lg text-center`}
              >
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-medium">{badge}</h3>
                <p className="text-sm opacity-75">Level {index + 1}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{selectedBadge.icon}</div>
                <h3 className="text-xl font-bold">{selectedBadge.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBadge.description}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r ${
                  badgeColors[selectedBadge.rarity]
                } text-white`}>
                  {selectedBadge.rarity.toUpperCase()}
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
