import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaFlask, FaMicrochip, FaUsers, FaLightbulb, 
  FaChartLine, FaGlobe, FaHandshake, FaSeedling 
} from "react-icons/fa";

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  stage: "ideation" | "planning" | "active" | "review" | "completed";
  type: "research" | "replication" | "implementation" | "validation";
  resources: {
    compute: {
      gpuHours: number;
      estimatedCost: number;
      pipelines: string[];
    };
    funding: {
      raised: number;
      goal: number;
      backers: number;
      allocations: Record<string, number>;
    };
    patents: {
      pending: number;
      granted: number;
      revenue: number;
      implementations: number;
    };
    team: {
      researchers: number;
      contributors: number;
      reviewers: number;
      stakeholders: number;
    };
  };
  impact: {
    scientific: number;
    economic: number;
    social: number;
    environmental: number;
  };
  outputs: {
    papers: string[];
    datasets: string[];
    code: string[];
    patents: string[];
  };
}

interface ResearchRole {
  id: string;
  type: "researcher" | "reviewer" | "contributor" | "stakeholder";
  expertise: string[];
  responsibilities: string[];
  compensation: {
    fundingShare: number;
    patentShare: number;
    computeAllocation: number;
    votingPower: number;
  };
}

interface ResearchMilestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  requirements: {
    compute: number;
    funding: number;
    team: number;
    validation: string[];
  };
  rewards: {
    funding: number;
    patents: number;
    reputation: number;
  };
  status: "pending" | "active" | "completed" | "delayed";
}

const researchCategories = {
  scientific: {
    icon: <FaFlask className="text-2xl" />,
    title: "Scientific Research",
    description: "Novel research projects and experiments",
    types: [
      {
        name: "Original Research",
        requirements: ["Compute Resources", "Team", "Protocol"],
        outputs: ["Papers", "Patents", "Datasets"]
      },
      {
        name: "Replication Studies",
        requirements: ["Original Protocol", "Validation Team", "Resources"],
        outputs: ["Validation", "Improvements", "Data"]
      },
      {
        name: "Meta-Analysis",
        requirements: ["Multiple Studies", "Analysis Team", "Methods"],
        outputs: ["Synthesis", "Recommendations", "Models"]
      }
    ]
  },
  implementation: {
    icon: <FaMicrochip className="text-2xl" />,
    title: "Implementation Projects",
    description: "Turning research into real-world solutions",
    types: [
      {
        name: "Technology Transfer",
        requirements: ["Patents", "Engineering Team", "Resources"],
        outputs: ["Products", "Documentation", "Training"]
      },
      {
        name: "Scale-Up",
        requirements: ["Prototype", "Infrastructure", "Validation"],
        outputs: ["Production", "Quality Control", "Distribution"]
      },
      {
        name: "Integration",
        requirements: ["Multiple Technologies", "Systems Team", "Testing"],
        outputs: ["Solutions", "Standards", "Support"]
      }
    ]
  },
  community: {
    icon: <FaUsers className="text-2xl" />,
    title: "Community Projects",
    description: "Collaborative research initiatives",
    types: [
      {
        name: "Citizen Science",
        requirements: ["Platform", "Training", "Data Collection"],
        outputs: ["Datasets", "Insights", "Publications"]
      },
      {
        name: "Open Source",
        requirements: ["Code", "Documentation", "Community"],
        outputs: ["Software", "Tools", "Knowledge"]
      },
      {
        name: "Education",
        requirements: ["Content", "Platform", "Mentors"],
        outputs: ["Courses", "Materials", "Skills"]
      }
    ]
  }
};

export function CollaborativeResearchHub() {
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [activeRole, setActiveRole] = useState<ResearchRole | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "kanban" | "timeline">("grid");
  const fetcher = useFetcher();

  return (
    <div className="collaborative-research p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Collaborative Research Hub ✨
          </h2>
          <p className="text-gray-600 mt-1">Collective science for collective progress</p>
        </div>

        <div className="flex gap-2">
          {["grid", "kanban", "timeline"].map(mode => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode as typeof viewMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === mode
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Research Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(researchCategories).map(([key, category]) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-blue-600">{category.icon}</div>
              <h3 className="font-bold">{category.title}</h3>
            </div>
            <div className="space-y-4">
              {category.types.map((type, index) => (
                <motion.div
                  key={index}
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium mb-2">{type.name}</h4>
                  
                  {/* Requirements */}
                  <div className="mb-3">
                    <h5 className="text-sm text-gray-600 mb-1">Requirements</h5>
                    <div className="flex flex-wrap gap-2">
                      {type.requirements.map(req => (
                        <span
                          key={req}
                          className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outputs */}
                  <div>
                    <h5 className="text-sm text-gray-600 mb-1">Outputs</h5>
                    <div className="flex flex-wrap gap-2">
                      {type.outputs.map(output => (
                        <span
                          key={output}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs"
                        >
                          {output}
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

      {/* Active Projects */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Active Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Project Card */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">Open Source Drug Discovery</h4>
                <p className="text-sm text-gray-600">
                  Collaborative research for affordable medicine
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                Active
              </span>
            </div>

            {/* Resource Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Compute</span>
                <div className="font-medium">1,234 GPU hrs</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Funding</span>
                <div className="font-medium">$50,000</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Team</span>
                <div className="font-medium">12 members</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Patents</span>
                <div className="font-medium">3 pending</div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="space-y-2 mb-4">
              {["scientific", "economic", "social", "environmental"].map(metric => (
                <div key={metric}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{metric} Impact</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm"
              >
                Join Team
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Research Roles */}
      <div className="bg-white rounded-xl p-6 border mb-8">
        <h3 className="font-bold mb-4">Research Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["researcher", "reviewer", "contributor", "stakeholder"].map(role => (
            <motion.div
              key={role}
              className="p-4 border rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium mb-2 capitalize">{role}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Funding Share</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Patent Share</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Compute</span>
                  <span>100 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Power</span>
                  <span>15%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Milestones Timeline */}
      <AnimatePresence>
        {showMilestones && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <h3 className="font-bold mb-4">Project Milestones</h3>
            <div className="space-y-4">
              {["Planning", "Research", "Development", "Testing", "Publication"].map((phase, index) => (
                <div key={phase} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{phase}</h4>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(5 - index) * 20}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {(5 - index) * 20}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
