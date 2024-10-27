import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: "data" | "experiment" | "analysis" | "collaboration" | "replication" | "visualization";
  difficulty: "beginner" | "intermediate" | "advanced";
  features: string[];
  requirements?: string[];
  templates?: string[];
  guides?: {
    title: string;
    url: string;
  }[];
}

const toolCategories = {
  data: {
    icon: "📊",
    color: "#4CAF50",
    tools: [
      "Data Collection Forms",
      "Sensor Integration",
      "Mobile Data Capture",
      "Data Validation",
      "Dataset Explorer"
    ]
  },
  experiment: {
    icon: "🧪",
    color: "#2196F3",
    tools: [
      "Protocol Builder",
      "Lab Notebook",
      "Variable Tracker",
      "Equipment Calibration",
      "Safety Checklist"
    ]
  },
  analysis: {
    icon: "🔍",
    color: "#9C27B0",
    tools: [
      "Statistical Analysis",
      "Data Visualization",
      "Pattern Recognition",
      "Hypothesis Testing",
      "Error Analysis"
    ]
  },
  collaboration: {
    icon: "🤝",
    color: "#FF9800",
    tools: [
      "Team Workspace",
      "Peer Review",
      "Resource Sharing",
      "Discussion Forums",
      "Project Timeline"
    ]
  },
  replication: {
    icon: "🔄",
    color: "#E91E63",
    tools: [
      "Method Validator",
      "Results Comparator",
      "Protocol Sharing",
      "Variation Tracker",
      "Success Metrics"
    ]
  },
  visualization: {
    icon: "📈",
    color: "#00BCD4",
    tools: [
      "Chart Builder",
      "Network Mapper",
      "3D Modeling",
      "Time Series",
      "Geographic Plot"
    ]
  }
};

const quickStartTemplates = [
  {
    name: "Citizen Science Project",
    description: "Start collecting data from your community",
    tools: ["Data Collection Forms", "Mobile Data Capture", "Team Workspace"]
  },
  {
    name: "Experiment Replication",
    description: "Validate and build upon existing research",
    tools: ["Protocol Builder", "Method Validator", "Results Comparator"]
  },
  {
    name: "Data Analysis Project",
    description: "Analyze and visualize your findings",
    tools: ["Statistical Analysis", "Data Visualization", "Pattern Recognition"]
  }
];

export function ResearchToolkit() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof toolCategories | null>(null);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fetcher = useFetcher();

  return (
    <div className="research-toolkit p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Research Toolkit 🔧
          </h2>
          <p className="text-gray-600 mt-1">Everything you need for your research journey!</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools..."
            className="px-4 py-2 rounded-lg bg-white shadow-sm w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Start Templates */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStartTemplates.map((template) => (
            <motion.div
              key={template.name}
              className="p-4 bg-white rounded-xl shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tool Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(toolCategories).map(([category, info]) => (
          <motion.button
            key={category}
            className={`p-4 rounded-xl text-center ${
              selectedCategory === category
                ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category as keyof typeof toolCategories)}
          >
            <span className="text-3xl mb-2 block">{info.icon}</span>
            <span className="font-medium capitalize">{category}</span>
          </motion.button>
        ))}
      </div>

      {/* Tool List */}
      {selectedCategory && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">{toolCategories[selectedCategory].icon}</span>
            <span className="capitalize">{selectedCategory} Tools</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolCategories[selectedCategory].tools.map((tool) => (
              <motion.div
                key={tool}
                className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveTool({ id: tool, name: tool } as Tool)}
              >
                <h4 className="font-medium mb-2">{tool}</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    Interactive
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                    Templates
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setActiveTool(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{activeTool.name}</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      Interactive
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      Beginner Friendly
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTool(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Tool Interface would go here */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600">
                  Tool interface and controls would be rendered here...
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
                >
                  Start Using Tool
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  View Tutorial
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  Share Tool
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
