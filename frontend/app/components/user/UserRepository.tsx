import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaCode, FaBook, FaFlask, FaLightbulb, FaBrain,
  FaShare, FaUsers, FaStar, FaHistory, FaRobot,
  FaDatabase, FaCogs, FaNetworkWired
} from "react-icons/fa";

// Enhanced Repository interface with AI features
interface Repository {
  id: string;
  name: string;
  description: string;
  type: "research" | "learning" | "project" | "community";
  visibility: "public" | "community" | "private";
  aiFeatures: {
    modelDevelopment?: {
      framework: string;
      architecture: string;
      trainingData: string[];
    };
    dataScience?: {
      datasets: string[];
      preprocessing: string[];
      analysis: string[];
    };
    collaboration?: {
      aiAgents: string[];
      humanCollaborators: string[];
      roles: Record<string, string>;
    };
    ethics?: {
      guidelines: string[];
      biasMetrics: Record<string, number>;
      transparencyScore: number;
    };
  };
  contents: {
    notebooks: string[];
    datasets: string[];
    papers: string[];
    code: string[];
  };
  metrics: {
    stars: number;
    forks: number;
    contributors: number;
    impact: number;
  };
  collectiveOwnership: {
    enabled: boolean;
    distribution: Record<string, number>;
    patentPool: boolean;
  };
}

// AI Tool Categories (similar to aiToolCategories)
const aiFeatureCategories = {
  modelDevelopment: {
    icon: <FaBrain className="text-2xl" />,
    title: "AI Model Development",
    description: "Tools for AI model creation and training",
    features: [
      "Distributed Training",
      "Model Parallelism",
      "Hyperparameter Optimization",
      "Architecture Search"
    ]
  },
  dataScience: {
    icon: <FaDatabase className="text-2xl" />,
    title: "Data Science Tools",
    description: "Data processing and analysis",
    features: [
      "Automated Cleaning",
      "Feature Engineering",
      "Dataset Synthesis",
      "Quality Metrics"
    ]
  },
  collaboration: {
    icon: <FaUsers className="text-2xl" />,
    title: "AI Collaboration",
    description: "AI-Human collaboration tools",
    features: [
      "Knowledge Sharing",
      "Model Merging",
      "Collective Learning",
      "Cross-Validation"
    ]
  }
};

// Fun repository descriptions
const funDescriptions = [
  "Where AI meets human creativity ✨",
  "Building the future, one commit at a time 🚀",
  "Collaborative science magic happening here 🧪",
  "Open source, open minds, open future 🌟",
  "Where ideas become reality 💫"
];

export function UserRepository() {
  const [activeFilter, setActiveFilter] = useState<"all" | "research" | "learning" | "community">("all");
  const [sortBy, setSortBy] = useState<"recent" | "impact" | "stars">("recent");
  const fetcher = useFetcher();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Knowledge Repository</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
        >
          <FaLightbulb className="inline mr-2" />
          New Repository
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {["all", "research", "learning", "community"].map(filter => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveFilter(filter as typeof activeFilter)}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === filter
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {repositories.map(repo => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{repo.name}</h3>
                  <p className="text-gray-600 text-sm">{repo.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  repo.visibility === "public" 
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {repo.visibility}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span><FaStar className="inline mr-1" />{repo.metrics.stars}</span>
                <span><FaUsers className="inline mr-1" />{repo.metrics.contributors}</span>
                <span><FaShare className="inline mr-1" />{repo.metrics.forks}</span>
              </div>

              {repo.collectiveOwnership.enabled && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-medium">Collective Ownership</div>
                  <div className="text-xs text-gray-600">
                    Contributing to Universal Basic Income
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {Object.keys(repo.contents).map(type => (
                  repo.contents[type].length > 0 && (
                    <span 
                      key={type}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {type}: {repo.contents[type].length}
                    </span>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
