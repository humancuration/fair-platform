import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaSeedling, FaMicrochip, FaHandshake, FaUsers, FaMusic, FaPalette, FaFlask, FaGraduationCap } from "react-icons/fa";

interface FundingAllocation {
  id: string;
  type: "science" | "art" | "music" | "education" | "infrastructure" | "community";
  percentage: number; // 0-1
  autoRenew: boolean;
  conditions?: {
    minProgress?: number;
    milestones?: string[];
    votingPower?: number;
  };
}

interface Project {
  id: string;
  title: string;
  category: FundingAllocation["type"];
  description: string;
  fundingGoal: number;
  currentFunding: number;
  supporters: {
    id: string;
    allocation: number;
    since: string;
  }[];
  milestones: {
    title: string;
    completed: boolean;
    evidence?: string;
  }[];
  impact: {
    scientific?: number;
    social?: number;
    cultural?: number;
    educational?: number;
  };
}

const fundingCategories = {
  science: {
    icon: <FaFlask className="text-2xl" />,
    title: "Scientific Research",
    description: "Fund breakthrough research projects",
    defaultMin: 0.05, // 5% minimum suggested
    examples: [
      "Climate Research",
      "Medical Studies",
      "Open Source AI",
      "Space Exploration"
    ]
  },
  art: {
    icon: <FaPalette className="text-2xl" />,
    title: "Arts & Culture",
    description: "Support artists and cultural projects",
    defaultMin: 0.02,
    examples: [
      "Digital Art",
      "Public Installations",
      "Cultural Preservation",
      "Virtual Museums"
    ]
  },
  music: {
    icon: <FaMusic className="text-2xl" />,
    title: "Music & Performance",
    description: "Fund musicians and performers",
    defaultMin: 0.02,
    examples: [
      "Independent Musicians",
      "Virtual Concerts",
      "Music Education",
      "Collaborative Projects"
    ]
  },
  education: {
    icon: <FaGraduationCap className="text-2xl" />,
    title: "Education",
    description: "Support educational initiatives",
    defaultMin: 0.05,
    examples: [
      "Online Courses",
      "Educational Tools",
      "Research Tutorials",
      "Skill Development"
    ]
  },
  infrastructure: {
    icon: <FaMicrochip className="text-2xl" />,
    title: "Infrastructure",
    description: "Fund shared infrastructure",
    defaultMin: 0.1,
    examples: [
      "Compute Resources",
      "Research Tools",
      "Data Storage",
      "Network Infrastructure"
    ]
  },
  community: {
    icon: <FaUsers className="text-2xl" />,
    title: "Community Projects",
    description: "Support community initiatives",
    defaultMin: 0.03,
    examples: [
      "Local Research",
      "Citizen Science",
      "Community Labs",
      "Educational Events"
    ]
  }
};

export function ParticipatoryFunding() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof fundingCategories | null>(null);
  const [allocations, setAllocations] = useState<FundingAllocation[]>([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const fetcher = useFetcher();

  const handleAllocation = (category: keyof typeof fundingCategories, percentage: number) => {
    // Validate total allocations don't exceed 100%
    const currentTotal = allocations.reduce((sum, a) => sum + a.percentage, 0);
    const remaining = 1 - currentTotal;
    
    if (percentage > remaining) {
      // Show warning or adjust percentage
      percentage = remaining;
    }

    setAllocations(prev => [
      ...prev,
      {
        id: `allocation-${Date.now()}`,
        type: category,
        percentage,
        autoRenew: true
      }
    ]);
  };

  return (
    <div className="participatory-funding p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Participatory Funding ✨
          </h2>
          <p className="text-gray-600 mt-1">Direct your UBI to projects you believe in</p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(fundingCategories).map(([key, category]) => (
          <motion.div
            key={key}
            className={`p-6 rounded-xl cursor-pointer ${
              selectedCategory === key
                ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-blue-500"
                : "bg-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCategory(key as keyof typeof fundingCategories)}
          >
            <div className="text-blue-600 mb-4">{category.icon}</div>
            <h3 className="font-bold mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            
            <div className="space-y-1">
              {category.examples.map((example, i) => (
                <div key={i} className="text-sm flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>{example}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Suggested minimum: {category.defaultMin * 100}% of UBI
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Allocations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Your UBI Allocations</h3>
        <div className="space-y-4">
          {allocations.map(allocation => (
            <div
              key={allocation.id}
              className="bg-white rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {fundingCategories[allocation.type].icon}
                <div>
                  <h4 className="font-medium">
                    {fundingCategories[allocation.type].title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {(allocation.percentage * 100).toFixed(1)}% of UBI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {allocation.autoRenew && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    Auto-renew
                  </span>
                )}
                <button
                  onClick={() => {
                    // Handle edit
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Remaining Unallocated</span>
              <span className="text-xl font-bold">
                {((1 - allocations.reduce((sum, a) => sum + a.percentage, 0)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${allocations.reduce((sum, a) => sum + a.percentage, 0) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-bold mb-4">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example projects would go here */}
          <motion.div
            className="p-4 border rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl mb-2">🧬</div>
            <h4 className="font-bold mb-1">Open Source Drug Discovery</h4>
            <p className="text-sm text-gray-600 mb-4">
              Collaborative research for affordable medicine
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Funding</span>
                <span>$123,456</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>324 supporters</span>
                <span>65% funded</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
