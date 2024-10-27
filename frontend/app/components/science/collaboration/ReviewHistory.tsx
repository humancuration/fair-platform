import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface Review {
  id: string;
  paperId: string;
  reviewer: {
    id: string;
    name: string;
    avatar: string;
    credentials: string[];
    reputation: number;
  };
  content: {
    summary: string;
    methodology: string;
    results: string;
    discussion: string;
    recommendations: string[];
  };
  rating: {
    methodology: number;
    clarity: number;
    significance: number;
    reproducibility: number;
  };
  status: "pending" | "completed" | "revised";
  visibility: "public" | "private";
  timestamp: string;
  discussions: Discussion[];
  socialShares: {
    platform: "twitter" | "linkedin" | "mastodon";
    url: string;
    engagement: number;
  }[];
}

interface Discussion {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: "researcher" | "student" | "citizen_scientist" | "practitioner";
  };
  content: string;
  attachments?: {
    type: "image" | "code" | "data";
    url: string;
  }[];
  timestamp: string;
  likes: number;
  replies: Discussion[];
  tags: string[];
}

const funMessages = {
  engagement: [
    "The science is getting social! 🧬",
    "Knowledge wants to be free! 🦋",
    "Peer review party! 🎉",
    "Science but make it fun! 🌟"
  ],
  quality: [
    "Rigorous AND readable! 📚",
    "Clear communication ftw! 🎯",
    "Making science accessible! 🌈",
    "Peer review goals! ✨"
  ]
};

export function ReviewHistory() {
  const [activeFilter, setActiveFilter] = useState<"all" | "public" | "private">("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const fetcher = useFetcher();

  const handleShare = (platform: "twitter" | "linkedin" | "mastodon", content: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#1DA1F2', '#0A66C2', '#6364FF']
    });
    
    fetcher.submit(
      { platform, content, intent: "share" },
      { method: "post" }
    );
  };

  return (
    <div className="review-history p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Review History & Discussions 🔬
          </h2>
          <p className="text-gray-600 mt-1">
            Open science in action
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "public", "private"].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter as typeof activeFilter)}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Review Timeline */}
      <div className="space-y-6">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  PR
                </div>
                <div>
                  <h3 className="font-bold">Paper Title {index + 1}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      Reviewed 2 days ago
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Public Review
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleShare("twitter", "Check out my latest review!")}
                  className="p-2 bg-[#1DA1F2] text-white rounded-full"
                >
                  𝕏
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleShare("linkedin", "Just reviewed an interesting paper...")}
                  className="p-2 bg-[#0A66C2] text-white rounded-full"
                >
                  in
                </motion.button>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-gray-700">
                  An interesting study exploring the intersection of AI and environmental science...
                </p>
              </div>

              {/* Rating Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Methodology", "Clarity", "Significance", "Reproducibility"].map((metric) => (
                  <div key={metric} className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">{metric}</div>
                    <div className="text-lg font-bold">4.5/5</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Discussion */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Public Discussion</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCommenting(true)}
                  className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                >
                  Add Comment 💭
                </motion.button>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                {[1, 2].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Researcher Name</span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            PhD Student
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Interesting findings! Have you considered the implications for...
                    </p>
                    <div className="flex gap-4 mt-2">
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        👍 12 Likes
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        💬 Reply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {isCommenting && (
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
              className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Add to the Discussion</h3>
              
              <textarea
                placeholder="Share your thoughts, questions, or insights..."
                className="w-full h-32 p-3 border rounded-lg mb-4"
              />

              <div className="flex items-center gap-4 mb-4">
                <button className="flex items-center gap-1 text-gray-600">
                  <span className="material-icons">attach_file</span>
                  Add Attachment
                </button>
                <div className="flex gap-2">
                  {["#methodology", "#results", "#future-work"].map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">
                    Also share on social media
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCommenting(false)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Handle post
                      setIsCommenting(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                  >
                    Post Comment ✨
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
