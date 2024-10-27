import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface ReplicationAttempt {
  id: string;
  originalStudyId: string;
  replicator: {
    id: string;
    name: string;
    avatar: string;
    credentials: string[];
  };
  status: "in-progress" | "completed" | "failed" | "inconclusive";
  methodology: {
    differences: string[];
    improvements: string[];
    limitations: string[];
  };
  results: {
    matches: boolean;
    confidence: number;
    keyFindings: string[];
    deviations: string[];
    rawData?: string; // URL to data
  };
  resources: {
    code?: string;
    data?: string;
    protocols?: string;
    materials?: string;
  };
  communityFeedback: {
    reviews: number;
    validations: number;
    suggestions: number;
  };
  timeline: {
    started: string;
    completed?: string;
    milestones: Array<{
      date: string;
      description: string;
    }>;
  };
}

const statusEmojis = {
  "in-progress": "🔬",
  "completed": "✅",
  "failed": "❌",
  "inconclusive": "❓"
};

const statusMessages = {
  "in-progress": [
    "Science in action! 🧪",
    "The quest for truth continues! 🔍",
    "Replication heroes at work! 👩‍🔬",
    "For science! 🚀"
  ],
  "completed": [
    "Knowledge validated! ✨",
    "Science wins again! 🎯",
    "Results are in! 📊",
    "Another brick in the wall of science! 🧱"
  ],
  "failed": [
    "Learning opportunity! 💡",
    "Back to the drawing board! 🎨",
    "Science is iterative! 🔄",
    "Failed successfully! 🎓"
  ],
  "inconclusive": [
    "The plot thickens! 🤔",
    "More questions! 🧩",
    "Science is complex! 🌌",
    "Mystery continues! 🔮"
  ]
};

export function ReplicationTracker() {
  const [selectedAttempt, setSelectedAttempt] = useState<ReplicationAttempt | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed" | "needs-review">("all");
  const fetcher = useFetcher();

  const handleValidate = (attemptId: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#22c55e', '#3b82f6', '#a855f7']
    });
    
    fetcher.submit(
      { attemptId, intent: "validate" },
      { method: "post", action: "/api/replications" }
    );
  };

  return (
    <div className="replication-tracker p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Replication Tracker 🧬
          </h2>
          <p className="text-gray-600 mt-1">
            Track and validate scientific replications together
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {/* Handle new replication */}}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
        >
          Start Replication ✨
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "in-progress", "completed", "needs-review"].map((filter) => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter as typeof activeFilter)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === filter
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.split("-").map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(" ")}
          </motion.button>
        ))}
      </div>

      {/* Replication Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-2xl">
                  {statusEmojis["in-progress"]}
                </div>
                <div>
                  <h3 className="font-bold">Study Replication {index + 1}</h3>
                  <p className="text-sm text-gray-600">
                    by Researcher {index + 1}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                In Progress
              </span>
            </div>

            {/* Progress Indicators */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Methodology Match</span>
                  <span>85%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Data Collection</span>
                  <span>60%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                  />
                </div>
              </div>
            </div>

            {/* Resource Links */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Protocol", "Code", "Data", "Materials"].map(resource => (
                <motion.a
                  key={resource}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:text-gray-900"
                >
                  📄 {resource}
                </motion.a>
              ))}
            </div>

            {/* Community Engagement */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-sm text-gray-600">
                <span>👥 12 Validators</span>
                <span>💭 8 Reviews</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAttempt({ id: `attempt-${index}` } as ReplicationAttempt)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm"
              >
                View Details ✨
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedAttempt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content would go here */}
              <div className="p-6">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                
                {/* Detailed replication info, methods, results, etc. */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
