import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaChartLine, FaUsers, FaHandHoldingHeart, FaBalanceScale, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface CreatorStats {
  totalEarnings: number;
  contributionTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  monthlyContribution: number;
  totalContributed: number;
  beneficiariesReached: number;
  impactScore: number;
  redistributionMetrics: {
    received: number;
    given: number;
    netImpact: number;
  };
}

interface FundMetrics {
  totalPool: number;
  activeContributors: number;
  totalBeneficiaries: number;
  averageDistribution: number;
  monthlyGrowth: number;
  sustainabilityScore: number;
  topCategories: {
    category: string;
    amount: number;
    recipients: number;
  }[];
}

const FundContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #43cea2, #185a9d);
  }
`;

const ProgressiveBar = styled.div<{ percentage: number; color: string }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;

  &::after {
    content: '';
    display: block;
    width: ${props => props.percentage}%;
    height: 100%;
    background: ${props => props.color};
    transition: width 1s ease-in-out;
  }
`;

const ContributionTiers = {
  bronze: { threshold: 1000, rate: 0.05, color: '#CD7F32' },
  silver: { threshold: 5000, rate: 0.10, color: '#C0C0C0' },
  gold: { threshold: 20000, rate: 0.15, color: '#FFD700' },
  platinum: { threshold: 50000, rate: 0.20, color: '#E5E4E2' },
};

const CreatorFund: React.FC = () => {
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [fundMetrics, setFundMetrics] = useState<FundMetrics | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    fetchCreatorStats();
    fetchFundMetrics();
  }, []);

  const fetchCreatorStats = async () => {
    try {
      const response = await fetch('/api/creator-fund/stats');
      const data = await response.json();
      setCreatorStats(data);
    } catch (error) {
      console.error('Failed to fetch creator stats:', error);
      toast.error('Could not load creator statistics');
    }
  };

  const fetchFundMetrics = async () => {
    try {
      const response = await fetch('/api/creator-fund/metrics');
      const data = await response.json();
      setFundMetrics(data);
    } catch (error) {
      console.error('Failed to fetch fund metrics:', error);
      toast.error('Could not load fund metrics');
    }
  };

  const calculateContributionRate = (earnings: number) => {
    const tier = Object.entries(ContributionTiers).find(
      ([_, { threshold }]) => earnings <= threshold
    );
    return tier ? tier[1].rate : ContributionTiers.platinum.rate;
  };

  return (
    <FundContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaHandHoldingHeart /> Universal Creator Fund
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowInfoModal(true)}
          >
            <FaInfoCircle className="text-gray-400" />
          </motion.button>
        </h2>
        {creatorStats && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">${creatorStats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm opacity-70">Total Earnings</div>
            </div>
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: ContributionTiers[creatorStats.contributionTier].color }}
              whileHover={{ scale: 1.05 }}
            >
              <FaCoins />
              <span>{creatorStats.contributionTier.toUpperCase()} Tier</span>
            </motion.div>
          </div>
        )}
      </div>

      {fundMetrics && (
        <MetricsGrid>
          <MetricCard whileHover={{ scale: 1.02 }}>
            <FaCoins className="text-2xl mb-2" />
            <h3 className="font-semibold">Fund Pool</h3>
            <div className="text-2xl font-bold mt-2">
              ${fundMetrics.totalPool.toLocaleString()}
            </div>
            <ProgressiveBar
              percentage={(fundMetrics.monthlyGrowth / 100) * 100}
              color="#43cea2"
            />
            <p className="text-sm mt-2">
              {fundMetrics.monthlyGrowth > 0 ? '+' : ''}{fundMetrics.monthlyGrowth}% Monthly Growth
            </p>
          </MetricCard>

          <MetricCard whileHover={{ scale: 1.02 }}>
            <FaUsers className="text-2xl mb-2" />
            <h3 className="font-semibold">Impact Reach</h3>
            <div className="text-2xl font-bold mt-2">
              {fundMetrics.totalBeneficiaries.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Active Beneficiaries</p>
            <div className="mt-2">
              <span className="text-sm">
                Avg. Distribution: ${fundMetrics.averageDistribution.toFixed(2)}
              </span>
            </div>
          </MetricCard>

          <MetricCard whileHover={{ scale: 1.02 }}>
            <FaBalanceScale className="text-2xl mb-2" />
            <h3 className="font-semibold">Sustainability Score</h3>
            <div className="text-2xl font-bold mt-2">
              {fundMetrics.sustainabilityScore.toFixed(1)}/10
            </div>
            <ProgressiveBar
              percentage={(fundMetrics.sustainabilityScore / 10) * 100}
              color="#185a9d"
            />
          </MetricCard>
        </MetricsGrid>
      )}

      {creatorStats && (
        <div className="mt-6 bg-opacity-10 bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Contribution Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monthly Contribution:</span>
                  <span>${creatorStats.monthlyContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Contributed:</span>
                  <span>${creatorStats.totalContributed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Beneficiaries Reached:</span>
                  <span>{creatorStats.beneficiariesReached.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Redistribution Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Given:</span>
                  <span className="text-green-400">
                    ${creatorStats.redistributionMetrics.given.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Received:</span>
                  <span className="text-blue-400">
                    ${creatorStats.redistributionMetrics.received.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Net Impact:</span>
                  <span className={creatorStats.redistributionMetrics.netImpact >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ${Math.abs(creatorStats.redistributionMetrics.netImpact).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 p-6 rounded-lg max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">About the Universal Creator Fund</h3>
              <p className="mb-4">
                The Universal Creator Fund implements a progressive contribution system where higher-earning creators
                contribute a larger percentage to support emerging artists and ensure platform sustainability.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Contribution Tiers:</h4>
                {Object.entries(ContributionTiers).map(([tier, { threshold, rate }]) => (
                  <div key={tier} className="flex justify-between items-center">
                    <span className="capitalize">{tier}:</span>
                    <span>Up to ${threshold.toLocaleString()} → {(rate * 100)}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FundContainer>
  );
};

export default CreatorFund;
