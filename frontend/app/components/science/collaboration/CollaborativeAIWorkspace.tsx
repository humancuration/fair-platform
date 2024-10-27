import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaBrain, FaRobot, FaUsers, FaCode, FaFlask,
  FaLightbulb, FaChartLine, FaComments, FaGlobe 
} from "react-icons/fa";

interface AICollaborator {
  id: string;
  name: string;
  type: "assistant" | "researcher" | "reviewer" | "analyst";
  capabilities: string[];
  specialization: string[];
  learningMode: boolean;
  adaptivePersonality: {
    style: "formal" | "casual" | "socratic" | "playful";
    adaptability: number;
    empathy: number;
  };
  metrics: {
    accuracy: number;
    helpfulness: number;
    creativity: number;
    reliability: number;
  };
}

interface HybridWorkspace {
  id: string;
  name: string;
  type: "research" | "analysis" | "brainstorming" | "review";
  participants: {
    humans: string[];
    ais: string[];
    roles: Record<string, string>;
  };
  features: {
    realTimeCollab: boolean;
    multimodal: boolean;
    contextAware: boolean;
    adaptiveLearning: boolean;
  };
  tools: {
    codeAssist: boolean;
    dataViz: boolean;
    literatureAnalysis: boolean;
    hypothesisGeneration: boolean;
  };
}

const workspaceTypes = {
  research: {
    icon: <FaFlask className="text-2xl" />,
    title: "Research Collaboration",
    description: "AI-enhanced research exploration",
    features: [
      {
        name: "Hypothesis Generation",
        description: "AI helps generate and refine research hypotheses",
        aiRole: "Suggests novel connections and research directions",
        humanRole: "Evaluates feasibility and relevance"
      },
      {
        name: "Literature Analysis",
        description: "Automated literature review and synthesis",
        aiRole: "Processes and summarizes papers",
        humanRole: "Guides focus and validates insights"
      },
      {
        name: "Experiment Design",
        description: "Collaborative protocol development",
        aiRole: "Suggests methodologies and controls",
        humanRole: "Refines and validates approaches"
      }
    ]
  },
  analysis: {
    icon: <FaChartLine className="text-2xl" />,
    title: "Data Analysis",
    description: "Human-AI collaborative analysis",
    features: [
      {
        name: "Pattern Discovery",
        description: "AI-powered pattern recognition with human insight",
        aiRole: "Identifies patterns and anomalies",
        humanRole: "Interprets significance and context"
      },
      {
        name: "Interactive Visualization",
        description: "Dynamic data exploration tools",
        aiRole: "Generates visualizations and insights",
        humanRole: "Guides exploration and interpretation"
      },
      {
        name: "Statistical Analysis",
        description: "Advanced statistical modeling",
        aiRole: "Performs complex analyses",
        humanRole: "Defines parameters and validates results"
      }
    ]
  },
  brainstorming: {
    icon: <FaLightbulb className="text-2xl" />,
    title: "Idea Generation",
    description: "Creative collaboration with AI",
    features: [
      {
        name: "Idea Expansion",
        description: "AI-enhanced brainstorming",
        aiRole: "Generates variations and connections",
        humanRole: "Selects and refines promising ideas"
      },
      {
        name: "Cross-Domain Insights",
        description: "Interdisciplinary connection discovery",
        aiRole: "Suggests cross-domain applications",
        humanRole: "Evaluates practical potential"
      },
      {
        name: "Concept Visualization",
        description: "Visual idea representation",
        aiRole: "Creates concept visualizations",
        humanRole: "Guides visual development"
      }
    ]
  }
};

const aiModes = {
  assistant: {
    name: "Research Assistant",
    description: "Supports research tasks and organization",
    capabilities: [
      "Literature search",
      "Data organization",
      "Reference management",
      "Task scheduling"
    ]
  },
  researcher: {
    name: "AI Researcher",
    description: "Active research collaboration",
    capabilities: [
      "Hypothesis generation",
      "Experimental design",
      "Data analysis",
      "Result interpretation"
    ]
  },
  reviewer: {
    name: "AI Reviewer",
    description: "Critical analysis and feedback",
    capabilities: [
      "Methodology review",
      "Statistical validation",
      "Literature comparison",
      "Suggestion generation"
    ]
  }
};

export function CollaborativeAIWorkspace() {
  const [activeWorkspace, setActiveWorkspace] = useState<HybridWorkspace | null>(null);
  const [selectedAI, setSelectedAI] = useState<AICollaborator | null>(null);
  const [workspaceMode, setWorkspaceMode] = useState<keyof typeof workspaceTypes>("research");
  const fetcher = useFetcher();

  return (
    <div className="ai-workspace p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            AI-Human Research Studio ✨
          </h2>
          <p className="text-gray-600 mt-1">Collaborative intelligence for scientific discovery</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaBrain /> Configure AI Team
          </motion.button>
        </div>
      </div>

      {/* Workspace Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(workspaceTypes).map(([type, info]) => (
          <motion.div
            key={type}
            className={`p-6 rounded-xl cursor-pointer ${
              workspaceMode === type
                ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-blue-500"
                : "bg-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setWorkspaceMode(type as keyof typeof workspaceTypes)}
          >
            <div className="text-blue-600 mb-4">{info.icon}</div>
            <h3 className="font-bold mb-2">{info.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{info.description}</p>
            
            <div className="space-y-4">
              {info.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium mb-2">{feature.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaRobot className="text-purple-500" />
                      <span>{feature.aiRole}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-blue-500" />
                      <span>{feature.humanRole}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Team Configuration */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaRobot /> AI Research Team
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(aiModes).map(([mode, info]) => (
            <motion.div
              key={mode}
              className="bg-white rounded-lg p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold mb-2">{info.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{info.description}</p>
              <div className="space-y-2">
                {info.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-500">•</span>
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Workspace Interface */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Active Workspace</h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm"
            >
              Save Progress
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm"
            >
              Share Workspace
            </motion.button>
          </div>
        </div>

        {/* Workspace content would go here */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
          Select a workspace type to begin collaboration
        </div>
      </div>
    </div>
  );
}
