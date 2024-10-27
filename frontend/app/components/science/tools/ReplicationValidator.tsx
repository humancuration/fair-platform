import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaCheck, FaTimes, FaQuestion, FaLightbulb, FaGraduationCap, FaUsers } from "react-icons/fa";

interface ReplicationAttempt {
  id: string;
  originalStudy: {
    title: string;
    authors: string[];
    doi: string;
    year: number;
    field: string;
    methodology: string;
  };
  status: "in_progress" | "successful" | "failed" | "inconclusive";
  differences: {
    methodology: string[];
    materials: string[];
    conditions: string[];
    analysis: string[];
  };
  results: {
    matches: boolean;
    effectSize: number;
    pValue: number;
    confidence: number;
    notes: string;
  };
  learningResources: {
    type: "video" | "guide" | "quiz" | "discussion";
    title: string;
    url: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }[];
  communityNotes: {
    author: string;
    text: string;
    type: "insight" | "question" | "suggestion";
    timestamp: string;
  }[];
}

interface ValidationMetrics {
  methodologicalRigor: number;
  dataTransparency: number;
  reproducibility: number;
  documentation: number;
}

const validationCategories = {
  methodology: {
    icon: "🔬",
    title: "Methodology Validation",
    description: "Verify experimental procedures and methods",
    checkpoints: [
      "Clear step-by-step procedures",
      "Variables properly controlled",
      "Sample size justification",
      "Randomization methods",
      "Blinding procedures"
    ]
  },
  data: {
    icon: "📊",
    title: "Data Validation",
    description: "Verify data collection and analysis",
    checkpoints: [
      "Raw data available",
      "Analysis code shared",
      "Statistical methods appropriate",
      "Power analysis performed",
      "Effect sizes reported"
    ]
  },
  materials: {
    icon: "🧰",
    title: "Materials Validation",
    description: "Verify materials and equipment",
    checkpoints: [
      "Materials fully listed",
      "Equipment specifications",
      "Reagent details",
      "Software versions",
      "Calibration methods"
    ]
  },
  reporting: {
    icon: "📝",
    title: "Reporting Validation",
    description: "Verify documentation and reporting",
    checkpoints: [
      "Methods fully described",
      "Results clearly presented",
      "Limitations discussed",
      "Raw data accessible",
      "Protocol registered"
    ]
  }
};

const educationalResources = {
  methods: {
    title: "Research Methods",
    resources: [
      {
        title: "Understanding P-values",
        type: "video",
        difficulty: "beginner",
        duration: "15 min"
      },
      {
        title: "Experimental Design Guide",
        type: "guide",
        difficulty: "intermediate",
        duration: "30 min"
      }
    ]
  },
  statistics: {
    title: "Statistical Analysis",
    resources: [
      {
        title: "Basic Statistics Quiz",
        type: "quiz",
        difficulty: "beginner",
        duration: "20 min"
      },
      {
        title: "Advanced Statistical Methods",
        type: "guide",
        difficulty: "advanced",
        duration: "45 min"
      }
    ]
  }
};

export function ReplicationValidator() {
  const [activeAttempt, setActiveAttempt] = useState<ReplicationAttempt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof validationCategories | null>(null);
  const [showEducationalResources, setShowEducationalResources] = useState(false);
  const fetcher = useFetcher();

  const handleValidationComplete = (metrics: ValidationMetrics) => {
    // Handle validation completion
  };

  return (
    <div className="replication-validator p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Replication Validator & Learning Hub ✨
          </h2>
          <p className="text-gray-600 mt-1">Validate research & learn scientific methods</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEducationalResources(!showEducationalResources)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaGraduationCap /> Learning Resources
          </motion.button>
        </div>
      </div>

      {/* Validation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(validationCategories).map(([key, category]) => (
          <motion.div
            key={key}
            className={`p-6 border rounded-lg cursor-pointer ${
              selectedCategory === key ? "border-blue-500 bg-blue-50" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCategory(key as keyof typeof validationCategories)}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="font-bold mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="space-y-2">
              {category.checkpoints.map((checkpoint, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FaCheck className="text-green-500" />
                  <span>{checkpoint}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Educational Resources Panel */}
      <AnimatePresence>
        {showEducationalResources && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FaGraduationCap /> Open Educational Resources
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(educationalResources).map(([key, section]) => (
                  <div key={key}>
                    <h4 className="font-medium mb-3">{section.title}</h4>
                    <div className="space-y-3">
                      {section.resources.map((resource, index) => (
                        <motion.div
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium mb-1">{resource.title}</h5>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{resource.duration}</span>
                                <span>•</span>
                                <span className="capitalize">{resource.difficulty}</span>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                              {resource.type}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Learning Section */}
              <div className="mt-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <FaUsers /> Community Learning
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <h5 className="font-medium mb-2">Study Groups</h5>
                    <p className="text-sm text-gray-600">
                      Join or create study groups to learn together
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="text-2xl mb-2">💡</div>
                    <h5 className="font-medium mb-2">Knowledge Sharing</h5>
                    <p className="text-sm text-gray-600">
                      Share insights and learn from others
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="text-2xl mb-2">🎯</div>
                    <h5 className="font-medium mb-2">Practice Tests</h5>
                    <p className="text-sm text-gray-600">
                      Free practice tests and materials
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Interface */}
      {selectedCategory && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold mb-4">
            {validationCategories[selectedCategory].title} Checklist
          </h3>
          <div className="space-y-4">
            {validationCategories[selectedCategory].checkpoints.map((checkpoint, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{checkpoint}</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-blue-600 text-sm hover:underline">
                        Add Notes
                      </button>
                      <button className="text-purple-600 text-sm hover:underline">
                        View Guide
                      </button>
                      <button className="text-green-600 text-sm hover:underline">
                        Community Tips
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
