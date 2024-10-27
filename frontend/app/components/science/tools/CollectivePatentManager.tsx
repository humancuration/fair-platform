import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaUsers, FaHandshake, FaLightbulb, FaGlobe, FaIndustry, FaSeedling, FaBalanceScale } from "react-icons/fa";

interface CollectivePatent {
  id: string;
  title: string;
  description: string;
  status: "draft" | "pending" | "active" | "licensed";
  type: "invention" | "process" | "software" | "design";
  contributors: {
    id: string;
    name: string;
    role: string;
    contributionType: "research" | "development" | "testing" | "documentation";
    sharePercentage: number;
    votingPower: number;
  }[];
  governance: {
    votingSystem: "quadratic" | "equal" | "stake-weighted";
    requiredApproval: number;
    votingPeriod: number;
    activeProposals: number;
  };
  licensing: {
    type: "open" | "fair-use" | "commercial";
    terms: string[];
    restrictions: string[];
    revenueModel: "universal" | "contributor" | "hybrid";
  };
  impact: {
    sdgGoals: string[];
    communities: string[];
    environmentalBenefit: string;
    socialBenefit: string;
  };
  implementation: {
    stage: "research" | "prototype" | "testing" | "production";
    partners: string[];
    timeline: string;
    resources: string[];
  };
}

interface PatentProposal {
  id: string;
  patentId: string;
  type: "licensing" | "modification" | "revenue" | "governance";
  proposer: string;
  description: string;
  votingDeadline: string;
  votes: {
    voter: string;
    vote: "for" | "against";
    power: number;
    rationale?: string;
  }[];
}

const patentCategories = {
  sustainable: {
    icon: <FaSeedling className="text-2xl" />,
    title: "Sustainable Technologies",
    description: "Innovations for environmental sustainability",
    examples: [
      "Clean Energy",
      "Waste Reduction",
      "Eco-materials",
      "Conservation"
    ]
  },
  social: {
    icon: <FaUsers className="text-2xl" />,
    title: "Social Impact",
    description: "Solutions for social challenges",
    examples: [
      "Healthcare Access",
      "Education Tools",
      "Community Systems",
      "Accessibility"
    ]
  },
  digital: {
    icon: <FaGlobe className="text-2xl" />,
    title: "Digital Commons",
    description: "Open source and digital innovations",
    examples: [
      "Open Protocols",
      "Data Tools",
      "Collaborative Platforms",
      "AI Models"
    ]
  }
};

const revenueModels = {
  universal: {
    title: "Universal Basic Income Pool",
    description: "Revenue contributes to platform-wide UBI system",
    distribution: [
      "40% to UBI pool",
      "30% to contributors",
      "20% to development",
      "10% to governance"
    ]
  },
  fair: {
    title: "Fair Commercial Use",
    description: "Balanced approach for commercial applications",
    distribution: [
      "Free for social impact",
      "Tiered pricing for business",
      "Revenue sharing with community",
      "Development fund allocation"
    ]
  },
  impact: {
    title: "Impact-Weighted Returns",
    description: "Returns based on measured social impact",
    distribution: [
      "Impact assessment metrics",
      "Community benefit sharing",
      "Sustainable development goals",
      "Local implementation support"
    ]
  }
};

export function CollectivePatentManager() {
  const [activePatent, setActivePatent] = useState<CollectivePatent | null>(null);
  const [activeProposal, setActiveProposal] = useState<PatentProposal | null>(null);
  const [showLicensing, setShowLicensing] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="collective-patent-manager p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Collective Patent System 🌱
          </h2>
          <p className="text-gray-600 mt-1">Democratizing innovation for the common good</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLicensing(!showLicensing)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaBalanceScale /> Licensing Hub
          </motion.button>
        </div>
      </div>

      {/* Patent Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(patentCategories).map(([key, category]) => (
          <motion.div
            key={key}
            className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-4 text-green-600">{category.icon}</div>
            <h3 className="font-bold mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="space-y-2">
              {category.examples.map((example, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{example}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Models */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaHandshake /> Collective Revenue Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(revenueModels).map(([key, model]) => (
            <motion.div
              key={key}
              className="bg-white rounded-lg p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold mb-2">{model.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{model.description}</p>
              <div className="space-y-2">
                {model.distribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-500">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Governance System */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaUsers /> Democratic Patent Governance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Voting Rights</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Quadratic voting system</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Contribution-based influence</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Transparent decision making</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Community oversight</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Licensing Control</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Fair use guidelines</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Impact-based pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Community benefit requirements</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Environmental standards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-green-100 text-green-700 rounded-lg text-center"
        >
          <FaLightbulb className="mx-auto mb-2" />
          Submit Patent
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-blue-100 text-blue-700 rounded-lg text-center"
        >
          <FaUsers className="mx-auto mb-2" />
          Join Project
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-purple-100 text-purple-700 rounded-lg text-center"
        >
          <FaHandshake className="mx-auto mb-2" />
          License Tech
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center"
        >
          <FaGlobe className="mx-auto mb-2" />
          View Impact
        </motion.button>
      </div>
    </div>
  );
}
