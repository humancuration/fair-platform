import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVoteYea, FaBrain, FaUserShield, FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface VotingPower {
  base: number;
  reputation: number;
  specialization: number;
  timeWeight: number;
  total: number;
}

interface VoteHistory {
  id: string;
  timestamp: string;
  type: 'spot' | 'curator' | 'policy';
  target: string;
  power: number;
  pattern: {
    timeVariance: number;
    distributionPattern: string;
    correlationScore: number;
  };
}

interface AIVoterRegistration {
  id: string;
  ownerId: string;
  specializations: string[];
  independenceScore: number;
  verificationLevel: number;
  behaviorPattern: {
    decisionLatency: number;
    voteDistribution: number[];
    crossValidation: number;
  };
}

const VotingContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
`;

const WarningBadge = styled(motion.div)`
  background: rgba(255, 87, 51, 0.2);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const VotingPowerMeter = styled.div<{ power: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => Math.min(props.power * 100, 100)}%;
    background: linear-gradient(90deg, #43cea2, #185a9d);
    transition: width 0.3s ease;
  }
`;

const VotingSystem: React.FC = () => {
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);
  const [aiVoters, setAiVoters] = useState<AIVoterRegistration[]>([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState<boolean>(false);

  useEffect(() => {
    fetchVotingPower();
    fetchVoteHistory();
    fetchAIVoters();
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

  const registerAIVoter = async (aiProfile: Partial<AIVoterRegistration>) => {
    try {
      // Check existing AI voters
      if (aiVoters.length >= 1) {
        const canRegisterMore = await validateAdditionalAIVoter(aiProfile);
        if (!canRegisterMore) {
          toast.error('Additional AI voter registration requires more validation');
          return;
        }
      }

      const response = await fetch('/api/voting/register-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiProfile)
      });

      if (!response.ok) throw new Error('Registration failed');
      
      const newAIVoter = await response.json();
      setAIVoters(prev => [...prev, newAIVoter]);
      toast.success('AI voter registered successfully');
    } catch (error) {
      console.error('Failed to register AI voter:', error);
      toast.error('Registration failed');
    }
  };

  const validateAdditionalAIVoter = async (profile: Partial<AIVoterRegistration>): Promise<boolean> => {
    // Check for unique specialization
    const hasUniqueSpecialization = !aiVoters.some(voter => 
      voter.specializations.some(spec => profile.specializations?.includes(spec))
    );

    // Verify independent behavior patterns
    const behaviorAnalysis = await analyzeVotingPatterns(profile.id!);
    const isIndependent = behaviorAnalysis.independenceScore > 0.8;

    // Community validation
    const communityTrust = await getCommunityTrustScore(profile.id!);
    const isTrusted = communityTrust > 0.7;

    return hasUniqueSpecialization && isIndependent && isTrusted;
  };

  const analyzeVotingPatterns = async (voterId: string) => {
    const patterns = voteHistory
      .filter(vote => vote.pattern)
      .map(vote => vote.pattern);

    // Look for suspicious patterns
    const timeVariance = calculateTimeVariance(patterns);
    const distributionAnalysis = analyzeDistributionPatterns(patterns);
    const correlationScore = calculateCorrelationScore(patterns);

    if (
      timeVariance < 0.3 || // Too regular voting times
      distributionAnalysis.entropy < 0.5 || // Too uniform distribution
      correlationScore > 0.8 // High correlation with other voters
    ) {
      setSuspiciousActivity(true);
    }

    return {
      independenceScore: (timeVariance + distributionAnalysis.entropy + (1 - correlationScore)) / 3
    };
  };

  return (
    <VotingContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FaVoteYea /> Voting System
      </h2>

      {votingPower && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
          <VotingPowerMeter power={votingPower.total / 100} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-sm opacity-70">Base Power</span>
              <div className="font-bold">{votingPower.base}</div>
            </div>
            <div>
              <span className="text-sm opacity-70">Reputation Bonus</span>
              <div className="font-bold">{votingPower.reputation}</div>
            </div>
          </div>
        </div>
      )}

      {suspiciousActivity && (
        <WarningBadge
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaExclamationTriangle className="text-red-400" />
          <span>Suspicious voting patterns detected. Please review our voting guidelines.</span>
        </WarningBadge>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaBrain /> AI Voters
        </h3>
        <div className="space-y-4">
          {aiVoters.map(voter => (
            <motion.div
              key={voter.id}
              className="bg-opacity-10 bg-white rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">AI Curator #{voter.id}</h4>
                  <div className="text-sm opacity-70">
                    Specializations: {voter.specializations.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Independence Score</div>
                  <div className="font-bold">{voter.independenceScore.toFixed(2)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaHistory /> Recent Votes
        </h3>
        <div className="space-y-2">
          {voteHistory.slice(0, 5).map(vote => (
            <motion.div
              key={vote.id}
              className="bg-opacity-5 bg-white rounded p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between">
                <span>{vote.type} vote on {vote.target}</span>
                <span className="opacity-70">
                  {new Date(vote.timestamp).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </VotingContainer>
  );
};

export default VotingSystem;
