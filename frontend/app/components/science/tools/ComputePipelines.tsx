import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaMicrochip, FaDna, FaAtom, FaBrain, 
  FaWind, FaCube, FaVial, FaPlay, FaPause, 
  FaDownload, FaChartLine 
} from "react-icons/fa";

interface ComputeJob {
  id: string;
  type: "ai" | "molecular" | "physics" | "genomics" | "materials" | "fluid";
  status: "queued" | "running" | "completed" | "failed";
  resources: {
    gpus: number;
    gpuType: string;
    memory: string;
    storage: string;
  };
  config: {
    framework?: string;
    model?: string;
    parameters: Record<string, any>;
    checkpointing: boolean;
    monitoring: boolean;
  };
  metrics: {
    progress: number;
    eta: string;
    cost: number;
    performance: {
      gpuUtilization: number;
      memoryUsage: number;
      throughput: number;
    };
  };
}

const pipelineTemplates = {
  ai: {
    icon: <FaBrain className="text-2xl" />,
    title: "AI/ML Pipelines",
    description: "Deep learning and machine learning workloads",
    templates: [
      {
        name: "Large Language Models",
        frameworks: ["PyTorch", "JAX", "TensorFlow"],
        features: ["Model Parallelism", "Gradient Checkpointing", "Mixed Precision"]
      },
      {
        name: "Computer Vision",
        frameworks: ["PyTorch", "TensorFlow"],
        features: ["Distributed Training", "AutoAugment", "Model Export"]
      },
      {
        name: "Reinforcement Learning",
        frameworks: ["PyTorch", "RLlib"],
        features: ["Multi-Agent", "Environment Parallelism", "Policy Optimization"]
      }
    ]
  },
  molecular: {
    icon: <FaDna className="text-2xl" />,
    title: "Molecular Dynamics",
    description: "Protein folding and molecular simulations",
    templates: [
      {
        name: "Protein Folding",
        frameworks: ["AlphaFold2", "RoseTTAFold"],
        features: ["Structure Prediction", "Complex Assembly", "Energy Minimization"]
      },
      {
        name: "Drug Discovery",
        frameworks: ["AutoDock", "GROMACS"],
        features: ["Virtual Screening", "Binding Affinity", "Conformer Generation"]
      },
      {
        name: "Molecular Design",
        frameworks: ["RDKit", "DeepChem"],
        features: ["Generative Models", "Property Prediction", "Reaction Prediction"]
      }
    ]
  },
  physics: {
    icon: <FaAtom className="text-2xl" />,
    title: "Physics Simulations",
    description: "Quantum and particle physics computations",
    templates: [
      {
        name: "Quantum Circuits",
        frameworks: ["Qiskit", "Cirq"],
        features: ["Circuit Optimization", "Error Mitigation", "State Tomography"]
      },
      {
        name: "Particle Physics",
        frameworks: ["GEANT4", "ROOT"],
        features: ["Event Generation", "Detector Simulation", "Analysis"]
      },
      {
        name: "Material Physics",
        frameworks: ["VASP", "Quantum ESPRESSO"],
        features: ["Band Structure", "Molecular Dynamics", "DFT Calculations"]
      }
    ]
  },
  fluid: {
    icon: <FaWind className="text-2xl" />,
    title: "Fluid Dynamics",
    description: "CFD and flow simulations",
    templates: [
      {
        name: "Aerodynamics",
        frameworks: ["OpenFOAM", "SU2"],
        features: ["Mesh Generation", "Turbulence Models", "Optimization"]
      },
      {
        name: "Weather Modeling",
        frameworks: ["WRF", "MPAS"],
        features: ["Multi-Scale", "Data Assimilation", "Ensemble Forecasting"]
      },
      {
        name: "Plasma Physics",
        frameworks: ["BOUT++", "GENE"],
        features: ["MHD Simulation", "Kinetic Models", "Turbulence Analysis"]
      }
    ]
  },
  materials: {
    icon: <FaCube className="text-2xl" />,
    title: "Materials Science",
    description: "Material design and analysis",
    templates: [
      {
        name: "Crystal Structure",
        frameworks: ["VESTA", "USPEX"],
        features: ["Structure Prediction", "Phase Diagrams", "Property Calculation"]
      },
      {
        name: "Polymer Design",
        frameworks: ["LAMMPS", "Materials Studio"],
        features: ["Chain Dynamics", "Mechanical Properties", "Aging Simulation"]
      },
      {
        name: "Composite Materials",
        frameworks: ["Abaqus", "ANSYS"],
        features: ["Stress Analysis", "Failure Prediction", "Optimization"]
      }
    ]
  }
};

export function ComputePipelines() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<ComputeJob[]>([]);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="compute-pipelines p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Scientific Compute Pipelines ✨
          </h2>
          <p className="text-gray-600 mt-1">High-performance computing for research</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMonitoring(!showMonitoring)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaChartLine /> Monitoring
          </motion.button>
        </div>
      </div>

      {/* Pipeline Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(pipelineTemplates).map(([key, category]) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-blue-600">{category.icon}</div>
              <h3 className="font-bold">{category.title}</h3>
            </div>
            <div className="space-y-4">
              {category.templates.map((template, index) => (
                <motion.div
                  key={index}
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium mb-2">{template.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.frameworks.map(framework => (
                      <span
                        key={framework}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                      >
                        {framework}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {template.features.map((feature, i) => (
                      <div key={i} className="text-sm flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Jobs */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Active Compute Jobs</h3>
        <div className="space-y-4">
          {activeJobs.map(job => (
            <motion.div
              key={job.id}
              className="bg-white rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium">{job.type.toUpperCase()} Job</h4>
                  <div className="text-sm text-gray-600">
                    {job.resources.gpuType} × {job.resources.gpus}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  job.status === "running" ? "bg-green-100 text-green-600" :
                  job.status === "queued" ? "bg-yellow-100 text-yellow-600" :
                  job.status === "completed" ? "bg-blue-100 text-blue-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{job.metrics.progress}% Complete</span>
                  <span>ETA: {job.metrics.eta}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${job.metrics.progress}%` }}
                  />
                </div>
              </div>

              {/* Resource Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">GPU Util</span>
                  <div className="font-medium">
                    {job.metrics.performance.gpuUtilization}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Memory</span>
                  <div className="font-medium">
                    {job.metrics.performance.memoryUsage}GB
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Cost</span>
                  <div className="font-medium">
                    ${job.metrics.cost.toFixed(2)}/hr
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-red-100 text-red-600 rounded-lg"
                >
                  <FaPause />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                >
                  <FaDownload />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resource Monitoring */}
      <AnimatePresence>
        {showMonitoring && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <h3 className="font-bold mb-4">Resource Monitoring</h3>
            {/* Monitoring graphs would go here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
