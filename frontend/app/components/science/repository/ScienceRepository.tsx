import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaGitAlt, FaCode, FaFlask, FaDatabase, FaProjectDiagram,
  FaHistory, FaBranch, FaMerge, FaCodeBranch, FaUsers 
} from "react-icons/fa";

interface ScienceArtifact {
  id: string;
  type: "protocol" | "data" | "analysis" | "workflow" | "model";
  name: string;
  description: string;
  version: string;
  path: string;
  history: {
    commits: Commit[];
    branches: Branch[];
    tags: Tag[];
  };
  metadata: {
    authors: string[];
    created: string;
    lastModified: string;
    dependencies?: string[];
    license: string;
  };
  validation: {
    tests: string[];
    reproducibility: number;
    coverage: number;
  };
}

interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  changes: {
    added: string[];
    modified: string[];
    removed: string[];
  };
  validation: {
    status: "passed" | "failed" | "pending";
    results: {
      test: string;
      status: "passed" | "failed";
      message?: string;
    }[];
  };
}

interface Branch {
  name: string;
  author: string;
  created: string;
  lastCommit: string;
  status: "active" | "stale" | "merged";
  protection: {
    requireReview: boolean;
    requiredTests: string[];
    autoMerge: boolean;
  };
}

interface Tag {
  name: string;
  type: "release" | "milestone" | "experiment";
  commit: string;
  message: string;
  artifacts: {
    type: string;
    url: string;
  }[];
}

const artifactTypes = {
  protocol: {
    icon: <FaFlask className="text-2xl" />,
    title: "Research Protocols",
    description: "Version-controlled experimental procedures",
    features: [
      "Step-by-step tracking",
      "Material changes",
      "Validation tests",
      "Reproducibility checks"
    ]
  },
  data: {
    icon: <FaDatabase className="text-2xl" />,
    title: "Research Data",
    description: "Dataset versioning and lineage",
    features: [
      "Data provenance",
      "Schema evolution",
      "Quality metrics",
      "Access control"
    ]
  },
  analysis: {
    icon: <FaCode className="text-2xl" />,
    title: "Analysis Code",
    description: "Scientific code management",
    features: [
      "Code versioning",
      "Dependency tracking",
      "Execution environment",
      "Results validation"
    ]
  },
  workflow: {
    icon: <FaProjectDiagram className="text-2xl" />,
    title: "Research Workflows",
    description: "End-to-end process tracking",
    features: [
      "Pipeline versions",
      "Component changes",
      "Configuration history",
      "Execution logs"
    ]
  }
};

const validationRules = {
  protocol: [
    "Materials available",
    "Steps complete",
    "Safety checked",
    "Equipment calibrated"
  ],
  data: [
    "Schema valid",
    "Quality metrics",
    "Completeness check",
    "Format validation"
  ],
  analysis: [
    "Code tests",
    "Input validation",
    "Output verification",
    "Performance check"
  ],
  workflow: [
    "Pipeline integrity",
    "Component compatibility",
    "Resource requirements",
    "Error handling"
  ]
};

export function ScienceRepository() {
  const [selectedArtifact, setSelectedArtifact] = useState<ScienceArtifact | null>(null);
  const [activeCommit, setActiveCommit] = useState<Commit | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="science-repository p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Science Repository ✨
          </h2>
          <p className="text-gray-600 mt-1">Version control for scientific artifacts</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaHistory /> History
          </motion.button>
        </div>
      </div>

      {/* Artifact Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(artifactTypes).map(([type, info]) => (
          <motion.div
            key={type}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-blue-600 mb-4">{info.icon}</div>
            <h3 className="font-bold mb-2">{info.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{info.description}</p>
            <div className="space-y-2">
              {info.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Version Control Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaGitAlt /> Version Control Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2">
              <FaCodeBranch className="text-purple-500" />
            </div>
            <h4 className="font-bold mb-2">Branching & Merging</h4>
            <ul className="space-y-2 text-sm">
              <li>• Feature branches</li>
              <li>• Experiment tracking</li>
              <li>• Peer review</li>
              <li>• Automated testing</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2">
              <FaHistory className="text-blue-500" />
            </div>
            <h4 className="font-bold mb-2">Change Tracking</h4>
            <ul className="space-y-2 text-sm">
              <li>• Detailed history</li>
              <li>• Change validation</li>
              <li>• Impact analysis</li>
              <li>• Rollback support</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2">
              <FaUsers className="text-green-500" />
            </div>
            <h4 className="font-bold mb-2">Collaboration</h4>
            <ul className="space-y-2 text-sm">
              <li>• Team workflows</li>
              <li>• Access control</li>
              <li>• Change proposals</li>
              <li>• Discussion threads</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Validation Rules */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4">Validation Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(validationRules).map(([type, rules]) => (
            <div key={type}>
              <h4 className="font-medium mb-3 capitalize">{type}</h4>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <h3 className="font-bold mb-4">Change History</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Update Protocol {index + 1}</h4>
                    <p className="text-sm text-gray-600">
                      Modified experimental procedure and updated materials list
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                        Validated
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        Peer Reviewed
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    2 days ago
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
