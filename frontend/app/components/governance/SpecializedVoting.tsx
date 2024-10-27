import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaVoteYea, FaHistory, FaExclamationTriangle, FaLock, FaUnlock, FaClock } from "react-icons/fa";

interface SpecializedVote {
  id: string;
  context: {
    type: "patent" | "policy" | "scientific" | "moderation" | "emergency";
    id: string;
    title: string;
    description: string;
  };
  vote: {
    power: number;
    direction: "for" | "against" | "abstain";
    timestamp: string;
    rationale?: string;
  };
  contestability: {
    period: number; // in hours
    remainingTime: number;
    canBeContested: boolean;
    requiredEvidence: string[];
    minimumDissenters: number;
    autoReviewThreshold: number; // percentage that triggers automatic review
  };
  escrow: {
    votingPowerLocked: number;
    releaseConditions: string[];
    releaseTime: string;
    status: "locked" | "released" | "contested" | "refunded";
  };
  review: {
    status: "none" | "pending" | "in_progress" | "completed";
    reviewers: string[];
    evidence: {
      type: string;
      url: string;
      timestamp: string;
    }[];
    outcome?: {
      decision: "upheld" | "reversed" | "modified";
      rationale: string;
      compensation?: {
        to: string;
        amount: number;
        reason: string;
      }[];
    };
  };
}

interface VotingContext {
  type: "patent" | "policy" | "scientific" | "moderation" | "emergency";
  requirements: {
    minimumVotingPower: number;
    contestabilityPeriod: number;
    escrowAmount: number;
    reviewThreshold: number;
    evidenceTypes: string[];
  };
  specialRules?: {
    quadraticVoting?: boolean;
    delegationAllowed?: boolean;
    anonymousVoting?: boolean;
    emergencyProtocol?: boolean;
  };
}

const votingContexts: Record<string, VotingContext> = {
  patent: {
    type: "patent",
    requirements: {
      minimumVotingPower: 100,
      contestabilityPeriod: 72, // hours
      escrowAmount: 50,
      reviewThreshold: 20, // percentage
      evidenceTypes: ["technical", "prior_art", "impact_assessment"]
    },
    specialRules: {
      quadraticVoting: true,
      delegationAllowed: true
    }
  },
  scientific: {
    type: "scientific",
    requirements: {
      minimumVotingPower: 200,
      contestabilityPeriod: 168, // 1 week
      escrowAmount: 100,
      reviewThreshold: 15,
      evidenceTypes: ["methodology", "data", "replication_results"]
    },
    specialRules: {
      quadraticVoting: true,
      anonymousVoting: true
    }
  },
  emergency: {
    type: "emergency",
    requirements: {
      minimumVotingPower: 500,
      contestabilityPeriod: 24,
      escrowAmount: 200,
      reviewThreshold: 10,
      evidenceTypes: ["security", "impact", "urgency"]
    },
    specialRules: {
      emergencyProtocol: true,
      delegationAllowed: false
    }
  }
};

export function SpecializedVoting() {
  const [activeVote, setActiveVote] = useState<SpecializedVote | null>(null);
  const [contestMode, setContestMode] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const fetcher = useFetcher();

  const handleVote = async (direction: "for" | "against" | "abstain", power: number) => {
    if (!activeVote) return;

    const context = votingContexts[activeVote.context.type];
    
    // Calculate escrow amount based on voting power
    const escrowAmount = Math.ceil(power * (context.requirements.escrowAmount / 100));

    try {
      const response = await fetch('/api/voting/specialized/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteId: activeVote.id,
          direction,
          power,
          escrow: escrowAmount,
          contestabilityPeriod: context.requirements.contestabilityPeriod
        })
      });

      if (!response.ok) throw new Error('Voting failed');
      
      // Handle successful vote
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  const handleContest = async (evidence: string[], rationale: string) => {
    if (!activeVote) return;

    try {
      const response = await fetch('/api/voting/contest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteId: activeVote.id,
          evidence,
          rationale
        })
      });

      if (!response.ok) throw new Error('Contest submission failed');
      
      setContestMode(false);
    } catch (error) {
      console.error('Failed to submit contest:', error);
    }
  };

  return (
    <div className="specialized-voting p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Specialized Voting System ✨
          </h2>
          <p className="text-gray-600 mt-1">
            Secure and contestable voting for important decisions
          </p>
        </div>
      </div>

      {/* Context Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(votingContexts).map(([key, context]) => (
          <motion.div
            key={key}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-bold mb-2 capitalize">{context.type} Voting</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Min. Power:</span>
                <span>{context.requirements.minimumVotingPower}</span>
              </div>
              <div className="flex justify-between">
                <span>Contest Period:</span>
                <span>{context.requirements.contestabilityPeriod}h</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow:</span>
                <span>{context.requirements.escrowAmount}%</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(context.specialRules || {}).map(([rule, enabled]) => (
                enabled && (
                  <span
                    key={rule}
                    className="px-2 py-1 bg-white rounded-full text-xs"
                  >
                    {rule.replace("_", " ")}
                  </span>
                )
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voting Interface */}
      {activeVote && (
        <div className="bg-white rounded-xl p-6 border mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg">{activeVote.context.title}</h3>
              <p className="text-gray-600">{activeVote.context.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Contest period: {activeVote.contestability.remainingTime}h remaining
              </span>
            </div>
          </div>

          {/* Voting Power Allocation */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Voting Power & Escrow
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Power to Use</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Escrow Amount</div>
                <div className="text-2xl font-bold text-purple-600">
                  50 VOTES
                </div>
                <div className="text-sm text-gray-500">
                  Locked for {activeVote.contestability.period}h
                </div>
              </div>
            </div>
          </div>

          {/* Voting Buttons */}
          <div className="flex gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote("for", 100)}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
            >
              Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote("against", 100)}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium"
            >
              Oppose
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote("abstain", 0)}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-medium"
            >
              Abstain
            </motion.button>
          </div>

          {/* Contest Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setContestMode(true)}
              className="px-4 py-2 text-purple-600 hover:text-purple-700"
            >
              <FaExclamationTriangle className="inline mr-2" />
              Contest this Vote
            </motion.button>
          </div>
        </div>
      )}

      {/* Contest Modal */}
      <AnimatePresence>
        {contestMode && (
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
              className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Contest Vote</h3>
              
              {/* Contest form would go here */}
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setContestMode(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleContest([], "")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg"
                >
                  Submit Contest
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
