import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaUsers, FaHandshake, FaGraduationCap, FaLightbulb, FaIndustry, FaSeedling } from "react-icons/fa";

interface CollectiveProject {
  id: string;
  title: string;
  description: string;
  stage: "research" | "development" | "implementation" | "distribution";
  contributors: {
    id: string;
    name: string;
    role: string;
    contributions: string[];
    shareAllocation: number;
  }[];
  patents: {
    id: string;
    title: string;
    status: "pending" | "approved" | "shared";
    contributors: string[];
    applications: string[];
  }[];
  resources: {
    type: "knowledge" | "equipment" | "funding" | "mentorship";
    available: boolean;
    details: string;
  }[];
  impact: {
    social: string[];
    environmental: string[];
    economic: string[];
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: {
    title: string;
    skills: string[];
    projects: string[];
    mentors: string[];
  }[];
  certification: {
    type: "skill" | "project" | "contribution";
    requirements: string[];
    validators: string[];
  };
}

const scienceValues = {
  collaboration: {
    icon: <FaUsers className="text-2xl" />,
    title: "Collective Progress",
    description: "Science advances through shared knowledge and collaborative effort",
    practices: [
      "Open peer review",
      "Shared credit allocation",
      "Collective decision making",
      "Community validation"
    ]
  },
  accessibility: {
    icon: <FaGraduationCap className="text-2xl" />,
    title: "Democratic Access",
    description: "Knowledge and resources available to all contributors",
    practices: [
      "Free education pathways",
      "Shared equipment access",
      "Transparent processes",
      "Multi-language support"
    ]
  },
  sustainability: {
    icon: <FaSeedling className="text-2xl" />,
    title: "Sustainable Impact",
    description: "Research that benefits society and environment",
    practices: [
      "Environmental impact assessment",
      "Social benefit metrics",
      "Long-term planning",
      "Resource sharing"
    ]
  },
  fairness: {
    icon: <FaHandshake className="text-2xl" />,
    title: "Equitable Distribution",
    description: "Fair distribution of benefits and opportunities",
    practices: [
      "Universal basic income",
      "Collective patent ownership",
      "Transparent revenue sharing",
      "Community governance"
    ]
  }
};

export function CollectiveScienceHub() {
  const [activeProject, setActiveProject] = useState<CollectiveProject | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const fetcher = useFetcher();

  return (
    <div className="collective-science p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Collective Science Hub 🌱
          </h2>
          <p className="text-gray-600 mt-1">Building a more equitable scientific future</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(scienceValues).map(([key, value]) => (
          <motion.div
            key={key}
            className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-4 text-green-600">{value.icon}</div>
            <h3 className="font-bold mb-2">{value.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{value.description}</p>
            <div className="space-y-2">
              {value.practices.map((practice, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning & Contribution Pathways */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaGraduationCap /> Learning & Contribution Pathways
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-3xl mb-4">🎓</div>
            <h4 className="font-bold mb-2">Skill Development</h4>
            <p className="text-sm text-gray-600 mb-4">
              Learn through doing and contribute while learning
            </p>
            <ul className="text-sm space-y-2">
              <li>• Practical research skills</li>
              <li>• Data analysis</li>
              <li>• Scientific writing</li>
              <li>• Project management</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-3xl mb-4">🤝</div>
            <h4 className="font-bold mb-2">Community Projects</h4>
            <p className="text-sm text-gray-600 mb-4">
              Join collective research initiatives
            </p>
            <ul className="text-sm space-y-2">
              <li>• Citizen science</li>
              <li>• Local research</li>
              <li>• Problem solving</li>
              <li>• Impact tracking</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-3xl mb-4">🌟</div>
            <h4 className="font-bold mb-2">Innovation & Patents</h4>
            <p className="text-sm text-gray-600 mb-4">
              Create and share intellectual property
            </p>
            <ul className="text-sm space-y-2">
              <li>• Collective patents</li>
              <li>• Shared ownership</li>
              <li>• Fair distribution</li>
              <li>• Social impact</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Collective Benefits */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaHandshake /> Collective Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">For Contributors</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Universal basic income from collective patents</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Free access to education and resources</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Fair credit and recognition</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Skill development and certification</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">For Society</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Accessible scientific knowledge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Sustainable technology development</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Reduced inequality in science</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Community-driven innovation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium"
        >
          Join the Scientific Commons ✨
        </motion.button>
        <p className="text-sm text-gray-600 mt-2">
          Be part of the future of collaborative science
        </p>
      </div>
    </div>
  );
}
