import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaMicrochip, FaServer, FaChartLine, FaUsers,
  FaLightbulb, FaHandshake, FaClock, FaCoins 
} from "react-icons/fa";

interface ComputeResource {
  id: string;
  type: "gpu" | "cpu" | "tpu" | "quantum";
  model: string;
  specs: {
    memory: string;
    cores: number;
    performance: number;
    powerEfficiency: number;
  };
  availability: {
    total: number;
    used: number;
    reserved: number;
    maintenance: number;
  };
  pricing: {
    base: number; // per hour
    dynamic: number; // current multiplier
    ubiDiscount: number; // percentage
    patentCredit: number; // available credit from patents
  };
  utilization: {
    current: number;
    history: {
      timestamp: string;
      value: number;
    }[];
    forecast: {
      timestamp: string;
      value: number;
    }[];
  };
}

interface ComputeJob {
  id: string;
  type: "research" | "training" | "inference" | "simulation";
  resources: ComputeResource[];
  duration: {
    estimated: number;
    actual?: number;
    remaining?: number;
  };
  cost: {
    estimated: number;
    current: number;
    ubiCovered: number;
    patentCredited: number;
  };
  priority: "low" | "normal" | "high" | "critical";
  status: "queued" | "running" | "completed" | "failed";
}

interface ResourceProvider {
  id: string;
  name: string;
  resources: ComputeResource[];
  reputation: {
    uptime: number;
    performance: number;
    support: number;
  };
  earnings: {
    total: number;
    ubiContribution: number;
    patentShare: number;
  };
  impact: {
    research: number;
    patents: number;
    training: number;
  };
}

const resourceCategories = {
  gpu: {
    icon: <FaMicrochip className="text-2xl" />,
    title: "GPU Clusters",
    description: "High-performance GPU computing",
    models: [
      {
        name: "Research Cluster",
        specs: ["A100 GPUs", "High Memory", "Optimized for Research"],
        features: ["Priority Queue", "Checkpointing", "Monitoring"]
      },
      {
        name: "Training Cluster",
        specs: ["H100 GPUs", "Distributed Training", "High Bandwidth"],
        features: ["Auto-scaling", "Model Parallelism", "Metrics"]
      },
      {
        name: "Inference Cluster",
        specs: ["T4 GPUs", "Low Latency", "High Throughput"],
        features: ["Load Balancing", "Auto-scaling", "Monitoring"]
      }
    ]
  },
  specialized: {
    icon: <FaServer className="text-2xl" />,
    title: "Specialized Hardware",
    description: "Purpose-built compute resources",
    models: [
      {
        name: "TPU Pods",
        specs: ["TPU v4", "JAX Optimized", "High Memory"],
        features: ["ML Focused", "Fast Training", "Research Priority"]
      },
      {
        name: "Quantum Systems",
        specs: ["Quantum Processors", "Hybrid Computing", "Low Temp"],
        features: ["Quantum Circuits", "Error Correction", "Simulation"]
      },
      {
        name: "HPC Clusters",
        specs: ["CPU + GPU", "InfiniBand", "Parallel Computing"],
        features: ["MPI Support", "Job Scheduling", "Monitoring"]
      }
    ]
  }
};

const pricingModels = {
  standard: {
    name: "Pay as You Go",
    description: "Standard hourly pricing",
    features: [
      "No minimum commitment",
      "Usage-based billing",
      "Flexible scaling"
    ]
  },
  ubi: {
    name: "UBI Allocation",
    description: "Compute credits from UBI pool",
    features: [
      "Monthly allocation",
      "Priority for research",
      "Community support"
    ]
  },
  patent: {
    name: "Patent Credits",
    description: "Credits from patent contributions",
    features: [
      "Earned through patents",
      "Transferable credits",
      "Bonus for impact"
    ]
  }
};

const utilizationBands = {
  low: {
    range: [0, 30],
    color: "#4CAF50",
    pricing: 0.8
  },
  medium: {
    range: [31, 70],
    color: "#FF9800",
    pricing: 1.0
  },
  high: {
    range: [71, 100],
    color: "#F44336",
    pricing: 1.5
  }
};

export function ComputeResourceMarket() {
  const [selectedResource, setSelectedResource] = useState<ComputeResource | null>(null);
  const [activeJobs, setActiveJobs] = useState<ComputeJob[]>([]);
  const [showAllocation, setShowAllocation] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="compute-market p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Compute Resource Market ✨
          </h2>
          <p className="text-gray-600 mt-1">Democratic access to computing power</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllocation(!showAllocation)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaCoins /> My Allocations
          </motion.button>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(resourceCategories).map(([key, category]) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-blue-600">{category.icon}</div>
              <h3 className="font-bold">{category.title}</h3>
            </div>
            <div className="space-y-4">
              {category.models.map((model, index) => (
                <motion.div
                  key={index}
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium mb-2">{model.name}</h4>
                  
                  {/* Specifications */}
                  <div className="mb-3">
                    <h5 className="text-sm text-gray-600 mb-1">Specifications</h5>
                    <div className="flex flex-wrap gap-2">
                      {model.specs.map(spec => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h5 className="text-sm text-gray-600 mb-1">Features</h5>
                    <div className="flex flex-wrap gap-2">
                      {model.features.map(feature => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Models */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FaHandshake /> Pricing & Access Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(pricingModels).map(([key, model]) => (
            <motion.div
              key={key}
              className="bg-white rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold mb-2">{model.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{model.description}</p>
              <div className="space-y-2">
                {model.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4">Active Compute Jobs</h3>
        <div className="space-y-4">
          {/* Example Job Card */}
          <motion.div
            className="p-4 border rounded-lg"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold">Large Model Training</h4>
                <p className="text-sm text-gray-600">
                  Distributed training on research cluster
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                Running
              </span>
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">GPU Usage</span>
                <div className="font-medium">8x A100</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Duration</span>
                <div className="font-medium">12h remaining</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Cost</span>
                <div className="font-medium">$240/hr</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Coverage</span>
                <div className="font-medium">80% UBI</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm"
              >
                Stop
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm"
              >
                Monitor
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resource Allocation */}
      <AnimatePresence>
        {showAllocation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <h3 className="font-bold mb-4">My Resource Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">UBI Compute Credits</h4>
                <div className="text-2xl font-bold text-green-600">
                  $1,000
                </div>
                <p className="text-sm text-gray-600">
                  Monthly allocation
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Patent Credits</h4>
                <div className="text-2xl font-bold text-blue-600">
                  $2,500
                </div>
                <p className="text-sm text-gray-600">
                  From 3 active patents
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Usage This Month</h4>
                <div className="text-2xl font-bold text-purple-600">
                  $800
                </div>
                <p className="text-sm text-gray-600">
                  65% of allocation
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
