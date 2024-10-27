import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaUsers, FaCode, FaFlask, FaComments, 
  FaTasks, FaHistory, FaGitAlt, FaChartLine, FaCheck, FaComment, FaLightbulb, FaBrain 
} from "react-icons/fa";

interface CollaborationSpace {
  id: string;
  name: string;
  description: string;
  type: "research" | "development" | "replication" | "analysis";
  status: "active" | "archived" | "completed";
  team: {
    members: Collaborator[];
    roles: Record<string, string>;
    permissions: Record<string, string[]>;
  };
  resources: {
    repositories: string[];
    datasets: string[];
    compute: {
      allocated: number;
      used: number;
    };
    storage: string;
  };
  activities: {
    code: ActivityStream;
    discussion: ActivityStream;
    review: ActivityStream;
    analysis: ActivityStream;
  };
  integrations: {
    git: string[];
    data: string[];
    compute: string[];
    communication: string[];
  };
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  expertise: string[];
  availability: "active" | "busy" | "away";
  contributions: {
    type: string;
    count: number;
    impact: number;
  }[];
  reputationScore: number;
}

interface ActivityStream {
  items: {
    id: string;
    type: string;
    actor: string;
    action: string;
    target: string;
    timestamp: string;
    metadata: Record<string, any>;
  }[];
  filters: {
    types: string[];
    actors: string[];
    dateRange: [string, string];
  };
  stats: {
    total: number;
    byType: Record<string, number>;
    byActor: Record<string, number>;
  };
}

const collaborationFeatures = {
  codeReview: {
    icon: <FaCode className="text-2xl" />,
    title: "Code Review",
    description: "Collaborative code review and feedback",
    features: [
      "Inline comments",
      "Version comparison",
      "Automated checks",
      "Review assignments"
    ]
  },
  protocolReview: {
    icon: <FaFlask className="text-2xl" />,
    title: "Protocol Review",
    description: "Research protocol validation",
    features: [
      "Step verification",
      "Safety checks",
      "Equipment validation",
      "Material requirements"
    ]
  },
  discussion: {
    icon: <FaComments className="text-2xl" />,
    title: "Discussions",
    description: "Team communication and decisions",
    features: [
      "Threaded comments",
      "File attachments",
      "Mentions & tags",
      "Decision tracking"
    ]
  },
  taskManagement: {
    icon: <FaTasks className="text-2xl" />,
    title: "Task Management",
    description: "Research task coordination",
    features: [
      "Task assignment",
      "Progress tracking",
      "Dependencies",
      "Timeline view"
    ]
  }
};

const integrationTypes = {
  version: {
    icon: <FaGitAlt />,
    name: "Version Control",
    platforms: ["Git", "GitHub", "GitLab"],
    features: ["Code", "Data", "Docs"]
  },
  compute: {
    icon: <FaMicrochip />,
    name: "Compute Resources",
    platforms: ["GPU Clusters", "HPC", "Cloud"],
    features: ["Scheduling", "Monitoring", "Cost"]
  },
  data: {
    icon: <FaDatabase />,
    name: "Data Management",
    platforms: ["S3", "IPFS", "DataHub"],
    features: ["Storage", "Versioning", "Access"]
  },
  communication: {
    icon: <FaComments />,
    name: "Communication",
    platforms: ["Matrix", "Discord", "Slack"],
    features: ["Chat", "Voice", "Video"]
  }
};

// Continue with component implementation...

export function ResearchCollaboration() {
  const [selectedSpace, setSelectedSpace] = useState<CollaborationSpace | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "discussion" | "tasks">("overview");
  const [showIntegrations, setShowIntegrations] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="research-collaboration p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Research Collaboration Space ✨
          </h2>
          <p className="text-gray-600 mt-1">Real-time scientific collaboration</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowIntegrations(!showIntegrations)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaGitAlt /> Integrations
          </motion.button>
        </div>
      </div>

      {/* Collaboration Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(collaborationFeatures).map(([key, feature]) => (
          <motion.div
            key={key}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-blue-600 mb-4">{feature.icon}</div>
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
            <div className="space-y-2">
              {feature.features.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Collaboration Space */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        {/* Space Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl">
            🧬
          </div>
          <div>
            <h3 className="text-xl font-bold">Drug Discovery Project</h3>
            <p className="text-gray-600">Collaborative research on novel therapeutics</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Team Members */}
            <div className="flex -space-x-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">
                +5
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm"
            >
              Join Team
            </motion.button>
          </div>
        </div>

        {/* Collaboration Tabs */}
        <div className="flex gap-4 mb-6">
          {["overview", "code", "discussion", "tasks"].map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-white shadow-sm"
                  : "hover:bg-white/50"
              }`}
            >
              {tab === "overview" && <FaChartLine />}
              {tab === "code" && <FaCode />}
              {tab === "discussion" && <FaComments />}
              {tab === "tasks" && <FaTasks />}
              <span className="capitalize">{tab}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Resource Usage */}
              <div>
                <h4 className="font-medium mb-4">Resource Usage</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Compute</div>
                    <div className="text-xl font-bold">1,234 hrs</div>
                    <div className="text-sm text-gray-500">GPU time used</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Storage</div>
                    <div className="text-xl font-bold">512 GB</div>
                    <div className="text-sm text-gray-500">Data stored</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Activity</div>
                    <div className="text-xl font-bold">89%</div>
                    <div className="text-sm text-gray-500">Weekly engagement</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Alice Chen</span>
                          {" updated the molecular analysis protocol"}
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-6">
              {/* Code Review Interface */}
              <div className="border rounded-lg">
                {/* Review Header */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">Analysis Pipeline Update</h4>
                      <p className="text-sm text-gray-600">
                        Improved data preprocessing and feature extraction
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          machine-learning
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                          data-processing
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        Updated 2 hours ago
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                        Ready for Review
                      </span>
                    </div>
                  </div>

                  {/* Review Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Changes</div>
                      <div className="font-medium">
                        <span className="text-green-600">+248</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-600">-124</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Files</div>
                      <div className="font-medium">12 modified</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Comments</div>
                      <div className="font-medium">8 discussions</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Reviewers</div>
                      <div className="font-medium">3 assigned</div>
                    </div>
                  </div>
                </div>

                {/* Code Changes */}
                <div className="divide-y">
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <FaCode /> analysis/preprocessing.py
                    </div>
                    
                    {/* Code Block with Inline Comments */}
                    <div className="font-mono text-sm bg-gray-50 rounded-lg">
                      {/* Unchanged Code */}
                      <div className="p-2 text-gray-500">
                        def preprocess_data(data: pd.DataFrame) -> pd.DataFrame:
                      </div>

                      {/* Added Code with Comment */}
                      <div className="relative">
                        <div className="p-2 bg-green-50 border-l-4 border-green-500">
                          <span className="text-green-700">
                            {"    # Add robust outlier detection"}
                          </span>
                        </div>
                        <div className="absolute right-2 top-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-1 text-gray-400 hover:text-blue-500"
                          >
                            <FaComments />
                          </motion.button>
                        </div>
                      </div>

                      {/* Modified Code with AI Suggestion */}
                      <div className="relative">
                        <div className="p-2 bg-yellow-50 border-l-4 border-yellow-500">
                          <span className="text-yellow-700">
                            {"    outliers = detect_outliers(data, method='isolation_forest')"}
                          </span>
                        </div>
                        <div className="absolute right-2 top-2 flex items-center gap-2">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            AI Suggestion
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-1 text-gray-400 hover:text-blue-500"
                          >
                            <FaLightbulb />
                          </motion.button>
                        </div>
                      </div>

                      {/* Comment Thread */}
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Alice Chen</span>
                                <span className="text-xs text-gray-500">2 hours ago</span>
                              </div>
                              <p className="text-sm mt-1">
                                Consider using DBSCAN for better cluster-based outlier detection
                              </p>
                              <div className="flex gap-2 mt-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  👍 2
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Reply
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* AI Assistant Response */}
                          <div className="flex items-start gap-3 pl-8">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs">
                              AI
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">AI Assistant</span>
                                <span className="text-xs text-gray-500">1 hour ago</span>
                              </div>
                              <p className="text-sm mt-1">
                                DBSCAN would be particularly effective here due to the non-uniform distribution of your data. Here's a suggested implementation:
                              </p>
                              <div className="bg-white rounded mt-2 p-2 font-mono text-xs">
                                from sklearn.cluster import DBSCAN
                                <br />
                                outlier_detector = DBSCAN(eps=0.3, min_samples=5)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FaCheck /> Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FaComment /> Request Changes
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>CI Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      All Tests Passing
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Review Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaBrain /> AI Review Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Code follows best practices for scientific computing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Test coverage is adequate (92%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">!</span>
                    <span>Consider adding more documentation for the outlier detection parameters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue with other tabs... */}
        </div>
      </div>
    </div>
  );
}
