import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaSeedling, FaMicrochip, FaHandshake, FaUsers, FaChartLine, FaLightbulb } from "react-icons/fa";

interface DividendSource {
  id: string;
  type: "patent" | "gpu" | "content" | "research" | "implementation" | "community";
  revenue: number;
  contributors: {
    id: string;
    role: string;
    shares: number;
    contributions: string[];
  }[];
  impact: {
    scientific: number;
    economic: number;
    social: number;
    environmental: number;
  };
  distribution: {
    ubi: number; // Percentage to UBI pool
    contributors: number; // Direct contributor rewards
    reinvestment: number; // R&D, infrastructure
    community: number; // Community projects
  };
}

interface ContributorMetrics {
  id: string;
  contributions: {
    patents: number;
    computeResources: number;
    content: number;
    research: number;
    community: number;
  };
  earnings: {
    direct: number;
    ubi: number;
    reinvestment: number;
  };
  impact: {
    scientific: number;
    economic: number;
    social: number;
  };
}

const revenueStreams = {
  patents: {
    icon: <FaLightbulb />,
    title: "Patent Pool",
    description: "Collective patent ownership & licensing",
    distribution: {
      ubi: 40,
      contributors: 30,
      reinvestment: 20,
      community: 10
    }
  },
  gpu: {
    icon: <FaMicrochip />,
    title: "Compute Resources",
    description: "Shared GPU/compute marketplace",
    distribution: {
      ubi: 35,
      contributors: 35,
      reinvestment: 20,
      community: 10
    }
  },
  content: {
    icon: <FaUsers />,
    title: "Content & Education",
    description: "Educational content & resources",
    distribution: {
      ubi: 30,
      contributors: 40,
      reinvestment: 20,
      community: 10
    }
  },
  research: {
    icon: <FaSeedling />,
    title: "Research Impact",
    description: "Scientific research & replication",
    distribution: {
      ubi: 40,
      contributors: 30,
      reinvestment: 20,
      community: 10
    }
  }
};

export function UniversalDividendSystem() {
  const [selectedStream, setSelectedStream] = useState<keyof typeof revenueStreams | null>(null);
  const [showDistribution, setShowDistribution] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="universal-dividend p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Universal Science Dividend System ✨
          </h2>
          <p className="text-gray-600 mt-1">Collective ownership & shared prosperity</p>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(revenueStreams).map(([key, stream]) => (
          <motion.div
            key={key}
            className={`p-6 rounded-xl cursor-pointer ${
              selectedStream === key
                ? "bg-gradient-to-br from-green-100 to-blue-100 border-2 border-blue-500"
                : "bg-gradient-to-br from-gray-50 to-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedStream(key as keyof typeof revenueStreams)}
          >
            <div className="text-2xl mb-4 text-blue-600">{stream.icon}</div>
            <h3 className="font-bold mb-2">{stream.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{stream.description}</p>
            
            <div className="space-y-2">
              {Object.entries(stream.distribution).map(([type, percentage]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize">{type}</span>
                  <span>{percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Distribution Visualization */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaChartLine /> Revenue Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2 text-green-500">
              <FaUsers />
            </div>
            <h4 className="font-bold mb-1">UBI Pool</h4>
            <p className="text-sm text-gray-600">
              Universal basic income for all participants
            </p>
            <div className="text-xl font-bold mt-2 text-green-600">40%</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2 text-blue-500">
              <FaHandshake />
            </div>
            <h4 className="font-bold mb-1">Contributors</h4>
            <p className="text-sm text-gray-600">
              Direct rewards for active contributors
            </p>
            <div className="text-xl font-bold mt-2 text-blue-600">30%</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2 text-purple-500">
              <FaSeedling />
            </div>
            <h4 className="font-bold mb-1">Reinvestment</h4>
            <p className="text-sm text-gray-600">
              R&D and infrastructure development
            </p>
            <div className="text-xl font-bold mt-2 text-purple-600">20%</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2 text-orange-500">
              <FaUsers />
            </div>
            <h4 className="font-bold mb-1">Community</h4>
            <p className="text-sm text-gray-600">
              Community projects and initiatives
            </p>
            <div className="text-xl font-bold mt-2 text-orange-600">10%</div>
          </motion.div>
        </div>
      </div>

      {/* Contribution Impact */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaLightbulb /> Your Impact & Earnings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Contributions</h4>
            <div className="space-y-3">
              {["Patents", "Compute", "Content", "Research", "Community"].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{type}</span>
                      <span className="text-sm text-gray-600">Level 3</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Earnings Breakdown</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Direct Earnings</span>
                  <span className="font-bold">$1,234</span>
                </div>
                <div className="text-sm text-gray-600">
                  From direct contributions
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>UBI Share</span>
                  <span className="font-bold">$567</span>
                </div>
                <div className="text-sm text-gray-600">
                  From universal dividend pool
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Reinvestment Returns</span>
                  <span className="font-bold">$890</span>
                </div>
                <div className="text-sm text-gray-600">
                  From infrastructure investments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
