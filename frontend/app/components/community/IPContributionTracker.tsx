import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { IPContribution } from "~/types/community";

interface ContributionNode {
  id: string;
  title: string;
  type: "original" | "derivative" | "enhancement" | "application";
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  license: string;
  usageRights: string[];
  citations: number;
  derivatives: number;
  revenueGenerated: number;
  impactScore: number;
  parentId?: string;
  children: ContributionNode[];
}

interface IPContributionTrackerProps {
  contribution: IPContribution;
  onLicenseChange: (license: string) => void;
  onRightsChange: (rights: string[]) => void;
}

const licenseTypes = [
  { id: "mit", name: "MIT", description: "Very permissive, allows commercial use" },
  { id: "cc-by", name: "Creative Commons BY", description: "Requires attribution" },
  { id: "cc-by-sa", name: "CC BY-SA", description: "Share-alike required" },
  { id: "cc-by-nc", name: "CC BY-NC", description: "Non-commercial only" },
  { id: "proprietary", name: "Proprietary", description: "All rights reserved" },
  { id: "custom", name: "Custom License", description: "Define custom terms" }
];

const usageRightOptions = [
  "Commercial Use",
  "Modification",
  "Distribution",
  "Private Use",
  "Patent Use",
  "AI Training"
];

export function IPContributionTracker({ contribution, onLicenseChange, onRightsChange }: IPContributionTrackerProps) {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedRights, setSelectedRights] = useState<string[]>(contribution.usageRights);
  const fetcher = useFetcher();

  const handleRightsChange = (right: string) => {
    const newRights = selectedRights.includes(right)
      ? selectedRights.filter(r => r !== right)
      : [...selectedRights, right];
    
    setSelectedRights(newRights);
    onRightsChange(newRights);
  };

  return (
    <div className="ip-contribution-tracker bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Intellectual Property Tracking
          </h3>
          <p className="text-gray-600 mt-1">
            Manage your contribution's rights and track its impact
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLicenseModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
        >
          Update License
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Impact Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Citations</span>
              <span className="font-mono">{contribution.citations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Derivative Works</span>
              <span className="font-mono">{contribution.derivatives}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue Generated</span>
              <span className="font-mono">${contribution.revenueGenerated.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impact Score</span>
              <span className="font-mono">{contribution.impactScore}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Current License</h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{contribution.license}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Usage Rights:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {contribution.usageRights.map(right => (
                  <span
                    key={right}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    {right}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold mb-4">Contribution Tree</h4>
        <div className="relative">
          {/* Recursive tree visualization of parent/child contributions */}
          <ContributionTree node={contribution.tree} />
        </div>
      </div>

      {/* License Modal */}
      <AnimatePresence>
        {showLicenseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Update License</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Type
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={contribution.license}
                    onChange={(e) => onLicenseChange(e.target.value)}
                  >
                    {licenseTypes.map(license => (
                      <option key={license.id} value={license.id}>
                        {license.name} - {license.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Rights
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {usageRightOptions.map(right => (
                      <label
                        key={right}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRights.includes(right)}
                          onChange={() => handleRightsChange(right)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{right}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save
                    setShowLicenseModal(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContributionTree({ node }: { node: ContributionNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="pl-6 border-l-2 border-gray-200">
      <div className="relative py-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <img
            src={node.creator.avatar}
            alt={node.creator.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-medium">{node.title}</h4>
            <p className="text-sm text-gray-500">
              by {node.creator.username} • {node.type}
            </p>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {node.citations} citations • ${node.revenueGenerated.toFixed(2)} revenue
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4"
          >
            {node.children.map(child => (
              <ContributionTree key={child.id} node={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
