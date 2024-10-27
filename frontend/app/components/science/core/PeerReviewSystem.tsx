import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    avatar: string;
    credentials: string[];
    expertise: string[];
    verifiedPeer: boolean;
  };
  content: {
    summary: string;
    methodology: {
      score: number;
      comments: string;
    };
    results: {
      score: number;
      comments: string;
    };
    discussion: {
      score: number;
      comments: string;
    };
  };
  recommendation: "accept" | "revise" | "reject";
  confidence: number;
  timestamp: string;
  status: "draft" | "submitted" | "revised";
  publicComments: string[];
  privateComments?: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const reviewCategories = [
  { id: "methodology", label: "Methodology", icon: "🔬" },
  { id: "results", label: "Results & Analysis", icon: "📊" },
  { id: "discussion", label: "Discussion & Impact", icon: "💭" }
];

const confidenceLevels = [
  { value: 1, label: "Low Confidence", icon: "😅" },
  { value: 2, label: "Moderate Confidence", icon: "🤔" },
  { value: 3, label: "High Confidence", icon: "💪" },
  { value: 4, label: "Expert Level Confidence", icon: "🧠" }
];

const encouragingMessages = [
  "Science is a team sport! 🤝",
  "Peer review makes perfect! 📚",
  "Together we're smarter! 🧠",
  "Building on each other's work! 🏗️",
  "Making knowledge accessible! 🌟"
];

export function PeerReviewSystem() {
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("methodology");
  const fetcher = useFetcher();

  const handleSubmitReview = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ['#22c55e', '#3b82f6', '#a855f7']
    });
    
    fetcher.submit(
      { review: JSON.stringify(activeReview), intent: "submitReview" },
      { method: "post" }
    );
  };

  return (
    <div className="peer-review-system p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Open Peer Review ✨
          </h2>
          <p className="text-gray-600 mt-1">
            {encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsWriting(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
        >
          Write Review 📝
        </motion.button>
      </div>

      {/* Review Writing Interface */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-gray-50 rounded-xl p-6"
          >
            <div className="flex gap-4 mb-6">
              {reviewCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentSection(category.id)}
                  className={`flex-1 p-4 rounded-lg ${
                    currentSection === category.id
                      ? "bg-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-2xl block mb-2">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="space-y-6">
              {/* Score Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                  onChange={(e) => {
                    // Handle score change
                  }}
                />
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="Share your thoughts on the methodology, rigor, and potential improvements..."
                />
              </div>

              {/* Confidence Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Confidence
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {confidenceLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white rounded-lg border hover:border-blue-500"
                    >
                      <span className="text-2xl block mb-1">{level.icon}</span>
                      <span className="text-sm">{level.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Save Draft
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Submit Review ✨
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Reviews */}
      <div className="space-y-6">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  PR
                </div>
                <div>
                  <h3 className="font-bold">Anonymous Reviewer</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Verified Peer
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Expert in Field
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>

            <div className="space-y-4">
              {reviewCategories.map((category) => (
                <div key={category.id}>
                  <h4 className="font-medium flex items-center gap-2">
                    {category.icon} {category.label}
                  </h4>
                  <div className="mt-2 bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Score</span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <p className="text-gray-700">
                      Example feedback for {category.label.toLowerCase()}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <span className="text-sm text-gray-600">High Confidence Review</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                Discuss 💭
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
