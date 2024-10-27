import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaTable, FaChartBar, FaCode, FaBrain, 
  FaShare, FaSave, FaPlay, FaDownload 
} from "react-icons/fa";

interface Dataset {
  id: string;
  name: string;
  type: "tabular" | "timeseries" | "spatial" | "graph" | "image" | "text";
  size: number;
  columns?: string[];
  metadata: {
    source: string;
    license: string;
    lastUpdated: string;
    citations?: string[];
  };
  schema?: {
    fields: {
      name: string;
      type: string;
      description?: string;
      constraints?: string[];
    }[];
  };
}

interface Analysis {
  id: string;
  type: "statistical" | "ml" | "visualization" | "preprocessing";
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    default?: any;
    range?: [number, number];
    options?: string[];
  }[];
  computeRequirements: {
    gpu?: boolean;
    memory: string;
    estimatedTime: string;
  };
  code?: {
    python?: string;
    r?: string;
    julia?: string;
  };
}

interface AnalysisResult {
  id: string;
  analysisId: string;
  status: "running" | "completed" | "failed";
  outputs: {
    type: "plot" | "table" | "model" | "metrics";
    data: any;
    visualization?: string;
  }[];
  metrics?: {
    accuracy?: number;
    performance?: number;
    significance?: number;
  };
  computeUsage: {
    gpuHours: number;
    cpuHours: number;
    memory: number;
  };
}

const analysisTemplates = {
  statistical: {
    basic: {
      name: "Basic Statistics",
      description: "Summary statistics, correlations, and distributions",
      methods: [
        "Summary Statistics",
        "Correlation Analysis",
        "Distribution Fitting",
        "Hypothesis Testing"
      ]
    },
    advanced: {
      name: "Advanced Statistics",
      description: "Advanced statistical analysis and modeling",
      methods: [
        "Regression Analysis",
        "Time Series Analysis",
        "Factor Analysis",
        "Survival Analysis"
      ]
    }
  },
  ml: {
    supervised: {
      name: "Supervised Learning",
      description: "Train models with labeled data",
      methods: [
        "Classification",
        "Regression",
        "Neural Networks",
        "Ensemble Methods"
      ]
    },
    unsupervised: {
      name: "Unsupervised Learning",
      description: "Discover patterns in unlabeled data",
      methods: [
        "Clustering",
        "Dimensionality Reduction",
        "Anomaly Detection",
        "Association Rules"
      ]
    }
  },
  visualization: {
    exploratory: {
      name: "Exploratory Analysis",
      description: "Interactive data exploration and visualization",
      methods: [
        "Interactive Plots",
        "Dimensionality Reduction",
        "Network Visualization",
        "Geographic Mapping"
      ]
    },
    presentation: {
      name: "Presentation Graphics",
      description: "Publication-ready visualizations",
      methods: [
        "Statistical Plots",
        "Custom Themes",
        "Animation",
        "Interactive Dashboards"
      ]
    }
  }
};

export function DataAnalysisWorkbench() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [codeView, setCodeView] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="data-analysis p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Data Analysis Workbench ✨
          </h2>
          <p className="text-gray-600 mt-1">Powerful analysis tools for researchers</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCodeView(!codeView)}
            className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <FaCode /> {codeView ? "Hide Code" : "Show Code"}
          </motion.button>
        </div>
      </div>

      {/* Analysis Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(analysisTemplates).map(([category, templates]) => (
          <div key={category}>
            <h3 className="font-bold mb-4 capitalize">{category}</h3>
            <div className="space-y-4">
              {Object.entries(templates).map(([key, template]) => (
                <motion.div
                  key={key}
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-1">
                    {template.methods.map((method, i) => (
                      <div key={i} className="text-sm flex items-center gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{method}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Analysis Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data & Parameters */}
        <div className="space-y-6">
          {/* Dataset Selection */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold mb-4">Dataset</h3>
            {selectedDataset ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{selectedDataset.name}</span>
                  <span className="text-sm text-gray-600">
                    {(selectedDataset.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-600">Source:</span>
                  <span>{selectedDataset.metadata.source}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                  >
                    Schema
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No dataset selected
              </div>
            )}
          </div>

          {/* Analysis Parameters */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold mb-4">Parameters</h3>
            {activeAnalysis?.parameters.map((param, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {param.name}
                </label>
                {param.type === "number" ? (
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    defaultValue={param.default}
                    min={param.range?.[0]}
                    max={param.range?.[1]}
                  />
                ) : param.type === "select" ? (
                  <select className="w-full p-2 border rounded">
                    {param.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={param.default}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results & Visualization */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Results</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-green-100 text-green-600 rounded-lg"
              >
                <FaPlay />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg"
              >
                <FaSave />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg"
              >
                <FaShare />
              </motion.button>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Result visualization would go here */}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Run analysis to see results
            </div>
          )}
        </div>
      </div>

      {/* Code View */}
      <AnimatePresence>
        {codeView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  {["python", "r", "julia"].map(lang => (
                    <button
                      key={lang}
                      className="px-3 py-1 rounded-full text-sm bg-gray-800"
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <FaDownload />
                </motion.button>
              </div>
              <pre className="text-sm">
                <code>
                  {/* Code would go here */}
                  import pandas as pd
                  import numpy as np
                  
                  # Load data
                  data = pd.read_csv("dataset.csv")
                  
                  # Perform analysis
                  results = analyze(data)
                  
                  # Visualize results
                  plot_results(results)
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
