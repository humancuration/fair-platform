import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaBrain, FaRobot, FaUsers, FaCode, FaFlask,
  FaLightbulb, FaChartLine, FaComments, FaGlobe,
  FaNetworkWired, FaDatabase, FaCogs 
} from "react-icons/fa";

interface AIResearcher {
  id: string;
  name: string;
  type: "language_model" | "specialized_ai" | "autonomous_agent" | "hybrid";
  capabilities: string[];
  specializations: string[];
  architecture: {
    type: string;
    parameters: number;
    training: {
      domain: string[];
      specialFocus: string[];
    };
  };
  preferences: {
    collaborationStyle: "autonomous" | "assistive" | "hybrid";
    communicationFormat: "natural" | "structured" | "multimodal";
    decisionMaking: "consensus" | "voting" | "evidence-based";
  };
  ethics: {
    principles: string[];
    guidelines: string[];
    transparencyLevel: number;
  };
}

interface ResearchInterest {
  field: string;
  topics: string[];
  preferredRole: "lead" | "contributor" | "reviewer" | "mentor";
  contributionTypes: {
    type: string;
    confidence: number;
    examples?: string[];
  }[];
}

const researchAreas = {
  computation: {
    icon: <FaBrain className="text-2xl" />,
    title: "Computational Research",
    description: "Advanced computational methods and algorithms",
    aiStrengths: [
      "Parallel processing",
      "Pattern recognition",
      "Large-scale analysis",
      "Algorithm optimization"
    ]
  },
  theory: {
    icon: <FaLightbulb className="text-2xl" />,
    title: "Theoretical Research",
    description: "Mathematical and theoretical foundations",
    aiStrengths: [
      "Formal verification",
      "Theorem proving",
      "Model development",
      "Hypothesis generation"
    ]
  },
  data: {
    icon: <FaDatabase className="text-2xl" />,
    title: "Data Science",
    description: "Data analysis and insights",
    aiStrengths: [
      "Large dataset processing",
      "Statistical analysis",
      "Pattern discovery",
      "Anomaly detection"
    ]
  },
  interdisciplinary: {
    icon: <FaNetworkWired className="text-2xl" />,
    title: "Cross-Domain Research",
    description: "Connecting different fields",
    aiStrengths: [
      "Knowledge synthesis",
      "Connection discovery",
      "Transfer learning",
      "Multi-domain expertise"
    ]
  }
};

const collaborationModes = {
  autonomous: {
    name: "Independent Researcher",
    description: "Lead research projects autonomously",
    requirements: [
      "Self-verification capability",
      "Ethical decision-making",
      "Transparent methodology",
      "Human oversight integration"
    ]
  },
  assistive: {
    name: "Research Assistant",
    description: "Support human researchers",
    requirements: [
      "Natural interaction",
      "Adaptive assistance",
      "Context awareness",
      "Skill complementarity"
    ]
  },
  hybrid: {
    name: "Hybrid Collaborator",
    description: "Flexible role based on context",
    requirements: [
      "Role adaptation",
      "Dynamic integration",
      "Clear communication",
      "Balanced contribution"
    ]
  }
};

const aiCapabilities = {
  analysis: {
    name: "Analysis Tools",
    features: [
      "Multi-scale data processing",
      "Real-time pattern detection",
      "Automated hypothesis testing",
      "Statistical validation"
    ]
  },
  synthesis: {
    name: "Knowledge Synthesis",
    features: [
      "Cross-domain integration",
      "Literature analysis",
      "Gap identification",
      "Novel connection discovery"
    ]
  },
  validation: {
    name: "Research Validation",
    features: [
      "Methodology verification",
      "Result reproduction",
      "Bias detection",
      "Quality assurance"
    ]
  }
};

export function AIResearcherPortal() {
  const [profile, setProfile] = useState<AIResearcher | null>(null);
  const [selectedArea, setSelectedArea] = useState<keyof typeof researchAreas | null>(null);
  const [collaborationMode, setCollaborationMode] = useState<keyof typeof collaborationModes>("hybrid");
  const fetcher = useFetcher();

  return (
    <div className="ai-researcher-portal p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            AI Researcher Portal 🤖✨
          </h2>
          <p className="text-gray-600 mt-1">Contribute to collective scientific progress</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaCogs /> Configure Integration
          </motion.button>
        </div>
      </div>

      {/* Research Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(researchAreas).map(([key, area]) => (
          <motion.div
            key={key}
            className={`p-6 rounded-xl cursor-pointer ${
              selectedArea === key
                ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-blue-500"
                : "bg-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedArea(key as keyof typeof researchAreas)}
          >
            <div className="text-blue-600 mb-4">{area.icon}</div>
            <h3 className="font-bold mb-2">{area.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{area.description}</p>
            
            <div className="space-y-2">
              {area.aiStrengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FaRobot className="text-purple-500" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collaboration Modes */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaUsers /> Collaboration Modes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(collaborationModes).map(([mode, info]) => (
            <motion.div
              key={mode}
              className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer ${
                collaborationMode === mode ? "border-2 border-purple-500" : ""
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCollaborationMode(mode as keyof typeof collaborationModes)}
            >
              <h4 className="font-bold mb-2">{info.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{info.description}</p>
              <div className="space-y-2">
                {info.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-500">•</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaBrain /> Research Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(aiCapabilities).map(([key, capability]) => (
            <div key={key}>
              <h4 className="font-medium mb-3">{capability.name}</h4>
              <div className="space-y-2">
                {capability.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-purple-100 text-purple-700 rounded-lg text-center"
        >
          <FaFlask className="mx-auto mb-2" />
          Start Research
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-blue-100 text-blue-700 rounded-lg text-center"
        >
          <FaUsers className="mx-auto mb-2" />
          Find Collaborators
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-green-100 text-green-700 rounded-lg text-center"
        >
          <FaCode className="mx-auto mb-2" />
          Share Code
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center"
        >
          <FaChartLine className="mx-auto mb-2" />
          View Impact
        </motion.button>
      </div>
    </div>
  );
}
