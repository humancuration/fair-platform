import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaVoteYea, FaLightbulb, FaHandshake, FaChartLine,
  FaUsers, FaSeedling, FaGlobe, FaBalanceScale 
} from "react-icons/fa";

interface ResearchProposal {
  id: string;
  title: string;
  description: string;
  stage: "draft" | "voting" | "funded" | "active" | "completed";
  category: "scientific" | "social" | "environmental" | "technological";
  resources: {
    estimatedFunding: number;
    computeNeeds: number;
    teamSize: number;
    duration: string;
  };
  voting: {
    quadraticVotes: number;
    stakeholders: number;
    consensus: number;
    deadline: string;
    delegations: {
      to: string;
      amount: number;
      conditions: string[];
    }[];
  };
  funding: {
    raised: number;
    goal: number;
    backers: number;
    ubiAllocation: number;
    patentRevenue: number;
  };
  impact: {
    sdgs: string[];
    communities: string[];
    potential: {
      scientific: number;
      economic: number;
      social: number;
    };
  };
  patents: {
    planned: string[];
    pending: string[];
    granted: string[];
    revenueModel: {
      ubi: number;
      contributors: number;
      reinvestment: number;
    };
  };
}

interface VotingPower {
  base: number;
  delegated: number;
  quadratic: number;
  expertise: {
    field: string;
    level: number;
    multiplier: number;
  }[];
  total: number;
}

interface FundingSource {
  id: string;
  type: "ubi" | "patent" | "community" | "grant";
  amount: number;
  conditions?: string[];
  allocation: {
    research: number;
    infrastructure: number;
    community: number;
  };
}

const researchCategories = {
  scientific: {
    icon: <FaLightbulb className="text-2xl" />,
    title: "Scientific Advancement",
    description: "Breakthrough research and discoveries",
    metrics: ["Citations", "Patents", "Implementations"],
    sdgs: ["Quality Education", "Industry Innovation"]
  },
  social: {
    icon: <FaUsers className="text-2xl" />,
    title: "Social Impact",
    description: "Community benefit and social progress",
    metrics: ["Communities Served", "Access", "Adoption"],
    sdgs: ["Reduced Inequalities", "Sustainable Communities"]
  },
  environmental: {
    icon: <FaSeedling className="text-2xl" />,
    title: "Environmental Solutions",
    description: "Sustainability and conservation",
    metrics: ["Carbon Reduction", "Resource Efficiency", "Biodiversity"],
    sdgs: ["Climate Action", "Life on Land", "Clean Energy"]
  },
  technological: {
    icon: <FaGlobe className="text-2xl" />,
    title: "Technology Transfer",
    description: "From research to real-world impact",
    metrics: ["Implementations", "Users", "Efficiency Gains"],
    sdgs: ["Industry Innovation", "Sustainable Cities"]
  }
};

const votingMethods = {
  quadratic: {
    name: "Quadratic Voting",
    description: "Vote strength increases quadratically with cost",
    benefits: [
      "Preference Intensity",
      "Whale Protection",
      "Democratic Distribution"
    ]
  },
  liquid: {
    name: "Expert Delegation",
    description: "Delegate votes to domain experts",
    benefits: [
      "Knowledge Leverage",
      "Efficient Allocation",
      "Specialization"
    ]
  },
  stake: {
    name: "Stake-weighted",
    description: "Voting power based on contribution",
    benefits: [
      "Skin in the Game",
      "Aligned Incentives",
      "Merit-based Influence"
    ]
  }
};

const fundingModels = {
  ubi: {
    name: "UBI Pool",
    description: "Collective basic income allocation",
    features: [
      "Democratic Allocation",
      "Stable Funding",
      "Community Support"
    ]
  },
  patent: {
    name: "Patent Revenue",
    description: "Shared intellectual property returns",
    features: [
      "Sustainable Income",
      "Innovation Rewards",
      "Reinvestment"
    ]
  },
  community: {
    name: "Community Pool",
    description: "Grassroots funding and support",
    features: [
      "Local Ownership",
      "Direct Impact",
      "Rapid Response"
    ]
  }
};

export function DemocraticResearchDirection() {
  const [selectedProposal, setSelectedProposal] = useState<ResearchProposal | null>(null);
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [activeVotes, setActiveVotes] = useState<string[]>([]);
  const [showDelegations, setShowDelegations] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="democratic-research p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Democratic Research Direction ✨
          </h2>
          <p className="text-gray-600 mt-1">Collective decisions for collective progress</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDelegations(!showDelegations)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaHandshake /> Delegate
          </motion.button>
        </div>
      </div>

      {/* Research Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(researchCategories).map(([key, category]) => (
          <motion.div
            key={key}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-blue-600 mb-4">{category.icon}</div>
            <h3 className="font-bold mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            
            {/* SDG Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category.sdgs.map(sdg => (
                <span
                  key={sdg}
                  className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs"
                >
                  {sdg}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="space-y-1">
              {category.metrics.map(metric => (
                <div key={metric} className="text-sm flex items-center gap-2">
                  <span className="text-purple-500">•</span>
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voting Methods */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaVoteYea /> Voting Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(votingMethods).map(([key, method]) => (
            <motion.div
              key={key}
              className="bg-white rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold mb-2">{method.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{method.description}</p>
              <div className="space-y-2">
                {method.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">•</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Funding Models */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaBalanceScale /> Funding Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(fundingModels).map(([key, model]) => (
            <motion.div
              key={key}
              className="p-4 border rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold mb-2">{model.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{model.description}</p>
              <div className="space-y-2">
                {model.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-500">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Proposals */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-bold mb-4">Active Proposals</h3>
        <div className="space-y-4">
          {/* Example Proposal Card */}
          <motion.div
            className="p-4 border rounded-lg"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold">Open Source Drug Discovery</h4>
                <p className="text-sm text-gray-600">
                  Collaborative research for affordable medicine
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                Voting Active
              </span>
            </div>

            {/* Voting Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Quadratic Votes</span>
                <span>1,234</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                />
              </div>
            </div>

            {/* Funding Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Funding Progress</span>
                <span>$50,000 / $100,000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm"
              >
                Vote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm"
              >
                Fund
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
