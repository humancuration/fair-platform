import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaUserShield, FaExchangeAlt, FaHistory, FaLock, FaUnlock, FaClock, FaTags } from "react-icons/fa";

interface Delegation {
  id: string;
  from: string;
  to: string;
  amount: number;
  topics: string[];
  timeLimit?: {
    start: string;
    end: string;
  };
  conditions: {
    revocable: boolean;
    transferable: boolean;
    minVotingPower?: number;
    requiredTopics?: string[];
    votingHistory?: {
      minParticipation: number;
      alignmentScore: number;
    };
  };
  status: "active" | "pending" | "revoked" | "expired";
  history: {
    action: "delegate" | "revoke" | "modify" | "transfer";
    timestamp: string;
    details: string;
  }[];
}

interface DelegationTemplate {
  id: string;
  name: string;
  description: string;
  defaultTopics: string[];
  suggestedTimeLimit?: {
    duration: number;
    unit: "days" | "weeks" | "months";
  };
  conditions: Partial<Delegation["conditions"]>;
}

const delegationTemplates: DelegationTemplate[] = [
  {
    id: "scientific",
    name: "Scientific Research",
    description: "Delegate voting power for research-related decisions",
    defaultTopics: ["research", "patents", "funding", "methodology"],
    suggestedTimeLimit: {
      duration: 6,
      unit: "months"
    },
    conditions: {
      revocable: true,
      transferable: false,
      minVotingPower: 100,
      requiredTopics: ["research"]
    }
  },
  {
    id: "governance",
    name: "Platform Governance",
    description: "Delegate for platform policy and governance decisions",
    defaultTopics: ["policy", "governance", "economics", "community"],
    suggestedTimeLimit: {
      duration: 3,
      unit: "months"
    },
    conditions: {
      revocable: true,
      transferable: true,
      votingHistory: {
        minParticipation: 0.8,
        alignmentScore: 0.7
      }
    }
  },
  {
    id: "technical",
    name: "Technical Development",
    description: "Delegate for technical and implementation decisions",
    defaultTopics: ["development", "infrastructure", "security", "protocols"],
    conditions: {
      revocable: true,
      transferable: false,
      requiredTopics: ["development"]
    }
  }
];

interface Props {
  onDelegationCreate: (delegation: Partial<Delegation>) => void;
  onDelegationRevoke: (delegationId: string) => void;
  activeDelegations: Delegation[];
}

export function DelegationManager({ onDelegationCreate, onDelegationRevoke, activeDelegations }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<DelegationTemplate | null>(null);
  const [customDelegation, setCustomDelegation] = useState<Partial<Delegation>>({});
  const [showHistory, setShowHistory] = useState(false);
  const fetcher = useFetcher();

  const handleTemplateSelect = (template: DelegationTemplate) => {
    setSelectedTemplate(template);
    setCustomDelegation({
      topics: template.defaultTopics,
      conditions: template.conditions,
      timeLimit: template.suggestedTimeLimit ? {
        start: new Date().toISOString(),
        end: new Date(Date.now() + template.suggestedTimeLimit.duration * 
          (template.suggestedTimeLimit.unit === "days" ? 86400000 :
           template.suggestedTimeLimit.unit === "weeks" ? 604800000 :
           2592000000)).toISOString()
      } : undefined
    });
  };

  return (
    <div className="delegation-manager space-y-6">
      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {delegationTemplates.map(template => (
          <motion.div
            key={template.id}
            className={`p-6 rounded-xl cursor-pointer ${
              selectedTemplate?.id === template.id
                ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-blue-500"
                : "bg-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleTemplateSelect(template)}
          >
            <h3 className="font-bold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="flex flex-wrap gap-2">
              {template.defaultTopics.map(topic => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delegation Configuration */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border"
          >
            <h3 className="font-bold mb-4">Configure Delegation</h3>
            
            {/* Delegate Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Delegate To
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Suggested delegates would go here */}
                <motion.div
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                    <div>
                      <div className="font-medium">Expert Delegate</div>
                      <div className="text-sm text-gray-600">High alignment score</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Voting Power Allocation */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Voting Power Allocation
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full"
                onChange={(e) => {
                  setCustomDelegation({
                    ...customDelegation,
                    amount: parseInt(e.target.value)
                  });
                }}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Topics and Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FaTags className="inline mr-2" />
                  Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {customDelegation.topics?.map(topic => (
                    <motion.span
                      key={topic}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      {topic}
                      <button
                        onClick={() => {
                          setCustomDelegation({
                            ...customDelegation,
                            topics: customDelegation.topics?.filter(t => t !== topic)
                          });
                        }}
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <FaLock className="inline mr-2" />
                  Conditions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={customDelegation.conditions?.revocable}
                      onChange={(e) => {
                        setCustomDelegation({
                          ...customDelegation,
                          conditions: {
                            ...customDelegation.conditions,
                            revocable: e.target.checked
                          }
                        });
                      }}
                    />
                    <span className="text-sm">Revocable</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={customDelegation.conditions?.transferable}
                      onChange={(e) => {
                        setCustomDelegation({
                          ...customDelegation,
                          conditions: {
                            ...customDelegation.conditions,
                            transferable: e.target.checked
                          }
                        });
                      }}
                    />
                    <span className="text-sm">Transferable</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Time Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                <FaClock className="inline mr-2" />
                Time Limit
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  className="p-2 border rounded"
                  value={customDelegation.timeLimit?.start}
                  onChange={(e) => {
                    setCustomDelegation({
                      ...customDelegation,
                      timeLimit: {
                        ...customDelegation.timeLimit!,
                        start: e.target.value
                      }
                    });
                  }}
                />
                <input
                  type="datetime-local"
                  className="p-2 border rounded"
                  value={customDelegation.timeLimit?.end}
                  onChange={(e) => {
                    setCustomDelegation({
                      ...customDelegation,
                      timeLimit: {
                        ...customDelegation.timeLimit!,
                        end: e.target.value
                      }
                    });
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelegationCreate(customDelegation)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
              >
                Create Delegation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Delegations */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Active Delegations</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-700"
          >
            <FaHistory className="inline mr-1" />
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>

        <div className="space-y-4">
          {activeDelegations.map(delegation => (
            <motion.div
              key={delegation.id}
              className="p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">To: {delegation.to}</div>
                  <div className="text-sm text-gray-600">
                    {delegation.amount} voting power
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelegationRevoke(delegation.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
                >
                  Revoke
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {delegation.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 pt-2 border-t"
                  >
                    <div className="text-sm text-gray-600">History</div>
                    {delegation.history.map((event, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </span>
                        <span>{event.details}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
