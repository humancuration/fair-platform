import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaVoteYea, FaChartLine, FaNetworkWired, FaUserClock, FaBrain } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Delegate {
  id: string;
  name: string;
  type: 'ai' | 'human' | 'hybrid';
  avatar: string;
  expertise: string[];
  votingPower: number;
  delegatedPower: number;
  trustScore: number;
  activeVotes: number;
  delegators: number;
  specializations: {
    genre: string;
    score: number;
  }[];
  recentDecisions: {
    type: string;
    outcome: string;
    support: number;
    timestamp: string;
  }[];
}

interface DelegationMetrics {
  totalDelegates: number;
  activeDelegations: number;
  averageTrustScore: number;
  topGenres: {
    genre: string;
    delegates: number;
  }[];
  delegationChains: {
    length: number;
    count: number;
  }[];
}

const DelegationContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const DelegateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DelegateCard = styled(motion.div)<{ type: 'ai' | 'human' | 'hybrid' }>`
  background: ${({ type }) => 
    type === 'ai' 
      ? 'linear-gradient(135deg, #6e48aa, #9d50bb)'
      : type === 'hybrid'
      ? 'linear-gradient(135deg, #43cea2, #185a9d)'
      : 'linear-gradient(135deg, #ff6b6b, #feca57)'};
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const DelegationChain = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
`;

const PowerMeter = styled.div<{ power: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.power}%;
    background: linear-gradient(90deg, #43cea2, #185a9d);
    transition: width 0.5s ease;
  }
`;

const CuratorDelegation: React.FC = () => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [metrics, setMetrics] = useState<DelegationMetrics | null>(null);
  const [userDelegations, setUserDelegations] = useState<string[]>([]);
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);

  useEffect(() => {
    fetchDelegates();
    fetchMetrics();
    fetchUserDelegations();
  }, []);

  const fetchDelegates = async () => {
    try {
      const response = await fetch('/api/delegation/delegates');
      const data = await response.json();
      setDelegates(data);
    } catch (error) {
      console.error('Failed to fetch delegates:', error);
      toast.error('Could not load delegates');
    }
  };

  const handleDelegate = async (delegateId: string) => {
    try {
      await fetch('/api/delegation/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegateId })
      });
      
      setUserDelegations(prev => [...prev, delegateId]);
      toast.success('Successfully delegated voting power!');
      fetchMetrics(); // Refresh metrics
    } catch (error) {
      console.error('Failed to delegate:', error);
      toast.error('Could not delegate voting power');
    }
  };

  const handleRevoke = async (delegateId: string) => {
    try {
      await fetch(`/api/delegation/revoke/${delegateId}`, { method: 'POST' });
      setUserDelegations(prev => prev.filter(id => id !== delegateId));
      toast.success('Successfully revoked delegation');
      fetchMetrics();
    } catch (error) {
      console.error('Failed to revoke delegation:', error);
      toast.error('Could not revoke delegation');
    }
  };

  return (
    <DelegationContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUserShield /> Curator Delegation System
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <FaVoteYea />
            {metrics?.activeDelegations} Active Delegations
          </span>
          <span className="flex items-center gap-2">
            <FaChartLine />
            {metrics?.averageTrustScore.toFixed(1)} Avg Trust Score
          </span>
        </div>
      </div>

      <DelegateGrid>
        <AnimatePresence>
          {delegates.map(delegate => (
            <DelegateCard
              key={delegate.id}
              type={delegate.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={delegate.avatar}
                    alt={delegate.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{delegate.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      {delegate.type === 'ai' && <FaBrain />}
                      <span>{delegate.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {delegate.votingPower + delegate.delegatedPower} VP
                  </div>
                  <div className="text-sm opacity-70">
                    {delegate.delegators} delegators
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Trust Score</span>
                  <span>{delegate.trustScore}%</span>
                </div>
                <PowerMeter power={delegate.trustScore} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {delegate.expertise.map(exp => (
                  <span
                    key={exp}
                    className="px-2 py-1 bg-white bg-opacity-10 rounded-full text-sm"
                  >
                    {exp}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold">Recent Decisions</div>
                {delegate.recentDecisions.slice(0, 3).map((decision, index) => (
                  <div
                    key={index}
                    className="text-sm flex justify-between items-center"
                  >
                    <span>{decision.type}</span>
                    <span className={
                      decision.support > 0.7 ? 'text-green-400' : 
                      decision.support > 0.4 ? 'text-yellow-400' : 
                      'text-red-400'
                    }>
                      {(decision.support * 100).toFixed(0)}% Support
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                className={`mt-4 w-full py-2 rounded-full ${
                  userDelegations.includes(delegate.id)
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => 
                  userDelegations.includes(delegate.id)
                    ? handleRevoke(delegate.id)
                    : handleDelegate(delegate.id)
                }
              >
                {userDelegations.includes(delegate.id) ? 'Revoke Delegation' : 'Delegate'}
              </motion.button>
            </DelegateCard>
          ))}
        </AnimatePresence>
      </DelegateGrid>

      {metrics && (
        <DelegationChain>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaNetworkWired /> Delegation Network
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Top Genres by Delegates</h4>
              {metrics.topGenres.map(genre => (
                <div
                  key={genre.genre}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{genre.genre}</span>
                  <span>{genre.delegates} delegates</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Delegation Chain Lengths</h4>
              {metrics.delegationChains.map(chain => (
                <div
                  key={chain.length}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{chain.length} hops</span>
                  <span>{chain.count} chains</span>
                </div>
              ))}
            </div>
          </div>
        </DelegationChain>
      )}
    </DelegationContainer>
  );
};

export default CuratorDelegation;
