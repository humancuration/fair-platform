import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { FaVoteYea, FaUserShield, FaExchangeAlt, FaUsers, FaChartPie, FaHistory } from "react-icons/fa";

interface Vote {
  id: string;
  voter: string;
  votingPower: number;
  direction: "for" | "against" | "abstain";
  context: {
    type: "patent" | "policy" | "curation" | "governance" | "funding";
    id: string;
    title: string;
  };
  delegations?: {
    from: string;
    amount: number;
    conditions?: {
      topics?: string[];
      timeLimit?: string;
      revocable: boolean;
    };
  }[];
  timestamp: string;
  rationale?: string;
}

interface VotingContext {
  id: string;
  type: "patent" | "policy" | "curation" | "governance" | "funding";
  title: string;
  description: string;
  options: string[];
  votingSystem: "quadratic" | "liquid" | "weighted" | "simple";
  threshold: number;
  deadline: string;
  status: "active" | "passed" | "failed" | "pending";
  metadata: {
    requiredStake?: number;
    minParticipation?: number;
    delegationAllowed?: boolean;
    anonymousVoting?: boolean;
  };
}

interface VotingPower {
  base: number;
  delegated: number;
  quadratic: number;
  reputation: number;
  total: number;
  availableDelegations: {
    from: string;
    amount: number;
    topics: string[];
  }[];
}

const votingMethods = {
  quadratic: {
    name: "Quadratic Voting",
    description: "Cost of votes increases quadratically",
    benefits: [
      "Prevents whale dominance",
      "Enables preference intensity",
      "More democratic outcomes",
      "Better for public goods"
    ]
  },
  liquid: {
    name: "Liquid Democracy",
    description: "Delegate your voting power to experts",
    benefits: [
      "Expert-driven decisions",
      "Flexible participation",
      "Topic-specific delegation",
      "Power redistribution"
    ]
  },
  weighted: {
    name: "Weighted Voting",
    description: "Voting power based on contribution & stake",
    benefits: [
      "Rewards participation",
      "Skin in the game",
      "Aligned incentives",
      "Merit-based influence"
    ]
  }
};

export function GlobalVotingSystem() {
  const [activeContext, setActiveContext] = useState<VotingContext | null>(null);
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [delegationMode, setDelegationMode] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    // Fetch voting power and available delegations
    fetchVotingPower();
  }, []);

  const fetchVotingPower = async () => {
    try {
      const response = await fetch('/api/voting/power');
      const data = await response.json();
      setVotingPower(data);
    } catch (error) {
      console.error('Failed to fetch voting power:', error);
    }
  };

  const handleVote = async (direction: "for" | "against" | "abstain", power: number) => {
    if (!activeContext) return;

    try {
      const response = await fetch('/api/voting/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextId: activeContext.id,
          direction,
          power,
          rationale: '', // Optional voting rationale
        })
      });

      if (!response.ok) throw new Error('Voting failed');
      
      // Update local state
      fetchVotingPower();
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  const handleDelegation = async (to: string, amount: number, topics?: string[]) => {
    try {
      const response = await fetch('/api/voting/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          amount,
          topics,
          revocable: true
        })
      });

      if (!response.ok) throw new Error('Delegation failed');
      
      // Update voting power
      fetchVotingPower();
      setDelegationMode(false);
    } catch (error) {
      console.error('Failed to delegate:', error);
    }
  };

  return (
    <div className="voting-system p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Collective Voting System ✨
          </h2>
          <p className="text-gray-600 mt-1">Democratic decision making for the commons</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDelegationMode(!delegationMode)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaExchangeAlt /> Delegate Power
          </motion.button>
        </div>
      </div>

      {/* Voting Power Display */}
      {votingPower && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-medium text-sm mb-1">Base Voting Power</h3>
            <div className="text-2xl font-bold">{votingPower.base}</div>
          </motion.div>

          <motion.div
            className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-medium text-sm mb-1">Delegated Power</h3>
            <div className="text-2xl font-bold">{votingPower.delegated}</div>
          </motion.div>

          <motion.div
            className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-medium text-sm mb-1">Quadratic Power</h3>
            <div className="text-2xl font-bold">{votingPower.quadratic}</div>
          </motion.div>

          <motion.div
            className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-medium text-sm mb-1">Total Power</h3>
            <div className="text-2xl font-bold">{votingPower.total}</div>
          </motion.div>
        </div>
      )}

      {/* Voting Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(votingMethods).map(([key, method]) => (
          <motion.div
            key={key}
            className="p-6 bg-white rounded-lg shadow-sm border"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-bold mb-2">{method.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{method.description}</p>
            <div className="space-y-2">
              {method.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delegation Interface */}
      <AnimatePresence>
        {delegationMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="font-bold mb-4">Delegate Your Voting Power</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Available Delegations</h4>
                  {votingPower?.availableDelegations.map((delegation, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-white rounded-lg mb-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center">
                        <span>{delegation.from}</span>
                        <span className="font-bold">{delegation.amount}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {delegation.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Delegate Power</h4>
                  {/* Delegation form would go here */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Votes */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-bold mb-4">Active Votes</h3>
        {/* List of active votes would go here */}
      </div>
    </div>
  );
}
