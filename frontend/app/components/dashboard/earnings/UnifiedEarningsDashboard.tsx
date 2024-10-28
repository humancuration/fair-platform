import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaChartLine, FaHandHoldingHeart, FaBalanceScale, FaHistory, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';

interface EarningsBreakdown {
  curatorEarnings: {
    playlists: number;
    recommendations: number;
    collaborations: number;
    total: number;
  };
  universalFund: {
    basicIncome: number;
    bonuses: number;
    total: number;
  };
  history: {
    date: string;
    amount: number;
    source: 'curator' | 'fund';
    type: string;
  }[];
  metrics: {
    monthlyGrowth: number;
    averageEarnings: number;
    projectedEarnings: number;
    sustainabilityScore: number;
  };
}

const DashboardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const EarningsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const EarningsCard = styled(motion.div)`
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

const HistorySection = styled(motion.div)`
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
`;

const TransactionItem = styled(motion.div)<{ type: 'curator' | 'fund' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: ${({ type }) => 
    type === 'curator' 
      ? 'linear-gradient(45deg, rgba(67, 206, 162, 0.1), rgba(24, 90, 157, 0.1))'
      : 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))'};
  border-radius: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const UnifiedEarningsDashboard: React.FC = () => {
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [timeframe]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`/api/earnings?timeframe=${timeframe}`);
      const data = await response.json();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      toast.error('Could not load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (!earnings) return null;

  const chartData = {
    labels: earnings.history.map(h => h.date),
    datasets: [
      {
        label: 'Curator Earnings',
        data: earnings.history
          .filter(h => h.source === 'curator')
          .map(h => h.amount),
        borderColor: '#43cea2',
        backgroundColor: 'rgba(67, 206, 162, 0.1)',
      },
      {
        label: 'Universal Fund',
        data: earnings.history
          .filter(h => h.source === 'fund')
          .map(h => h.amount),
        borderColor: '#9d50bb',
        backgroundColor: 'rgba(157, 80, 187, 0.1)',
      },
    ],
  };

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCoins /> Unified Earnings Dashboard
        </h2>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t as any)}
              className={`px-4 py-2 rounded-full ${
                timeframe === t 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <EarningsGrid>
        <EarningsCard whileHover={{ scale: 1.02 }}>
          <FaCoins className="text-2xl mb-2" />
          <h3 className="font-semibold">Curator Earnings</h3>
          <div className="text-2xl font-bold mt-2">
            ${earnings.curatorEarnings.total.toFixed(2)}
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Playlists</span>
              <span>${earnings.curatorEarnings.playlists.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Recommendations</span>
              <span>${earnings.curatorEarnings.recommendations.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Collaborations</span>
              <span>${earnings.curatorEarnings.collaborations.toFixed(2)}</span>
            </div>
          </div>
        </EarningsCard>

        <EarningsCard whileHover={{ scale: 1.02 }}>
          <FaHandHoldingHeart className="text-2xl mb-2" />
          <h3 className="font-semibold">Universal Fund</h3>
          <div className="text-2xl font-bold mt-2">
            ${earnings.universalFund.total.toFixed(2)}
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Basic Income</span>
              <span>${earnings.universalFund.basicIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bonuses</span>
              <span>${earnings.universalFund.bonuses.toFixed(2)}</span>
            </div>
          </div>
        </EarningsCard>

        <EarningsCard whileHover={{ scale: 1.02 }}>
          <FaChartLine className="text-2xl mb-2" />
          <h3 className="font-semibold">Metrics</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span>Monthly Growth</span>
              <span className={earnings.metrics.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                {earnings.metrics.monthlyGrowth > 0 ? '+' : ''}{earnings.metrics.monthlyGrowth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Projected</span>
              <span>${earnings.metrics.projectedEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sustainability</span>
              <span>{earnings.metrics.sustainabilityScore}/10</span>
            </div>
          </div>
        </EarningsCard>
      </EarningsGrid>

      <div className="mt-8 bg-gray-800 p-4 rounded-lg">
        <Line data={chartData} options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }} />
      </div>

      <HistorySection>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaHistory /> Transaction History
        </h3>
        <AnimatePresence>
          {earnings.history.map((transaction, index) => (
            <TransactionItem
              key={index}
              type={transaction.source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <div className="flex items-center gap-2">
                  {transaction.source === 'curator' ? <FaCoins /> : <FaHandHoldingHeart />}
                  <span className="font-semibold">{transaction.type}</span>
                </div>
                <span className="text-sm opacity-70">{transaction.date}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">${transaction.amount.toFixed(2)}</div>
                <span className="text-sm opacity-70">{transaction.source}</span>
              </div>
            </TransactionItem>
          ))}
        </AnimatePresence>
      </HistorySection>
    </DashboardContainer>
  );
};

export default UnifiedEarningsDashboard;
