import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHandsHelping, FaComments, FaGlobeAmericas, FaHeart, FaSeedling, FaUserFriends, FaLightbulb } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Contribution {
  id: string;
  type: 'comment' | 'review' | 'help' | 'event' | 'translation' | 'mentorship';
  content: string;
  impact: number;
  timestamp: string;
  recipientCount: number;
  languages?: string[];
  category?: string;
}

interface CommunityStats {
  helpfulActions: number;
  peopleReached: number;
  languagesSupported: string[];
  culturalExchanges: number;
  eventParticipation: number;
  knowledgeShared: {
    topics: number;
    resources: number;
    translations: number;
  };
  communityGrowth: {
    newConnections: number;
    collaborations: number;
    mentorships: number;
  };
}

const ContributionsContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const StatCard = styled(motion.div)`
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

const ContributionTimeline = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const TimelineItem = styled(motion.div)`
  padding: 15px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: #43cea2;
    border-radius: 50%;
    transform: translateY(-50%);
  }
`;

const ImpactBadge = styled(motion.div)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border-radius: 20px;
  padding: 8px 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 5px;
  font-size: 0.9rem;
`;

const CommunityContributions: React.FC = () => {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchCommunityStats();
    fetchContributions();
  }, [timeframe]);

  const fetchCommunityStats = async () => {
    try {
      const response = await fetch(`/api/community/stats?timeframe=${timeframe}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch community stats:', error);
      toast.error('Could not load community statistics');
    }
  };

  const fetchContributions = async () => {
    try {
      const response = await fetch(`/api/community/contributions?timeframe=${timeframe}`);
      const data = await response.json();
      setContributions(data);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      toast.error('Could not load contributions');
    }
  };

  const impactAreas = [
    { icon: <FaHandsHelping />, title: 'Community Support', description: 'Helped 100+ members' },
    { icon: <FaGlobeAmericas />, title: 'Cultural Bridge', description: 'Connected 5+ cultures' },
    { icon: <FaSeedling />, title: 'Growth Enabler', description: 'Mentored 10+ members' },
    { icon: <FaLightbulb />, title: 'Knowledge Sharer', description: 'Shared 50+ insights' }
  ];

  return (
    <ContributionsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUserFriends /> Community Impact
        </h2>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t as any)}
              className={`px-4 py-2 rounded-full ${
                timeframe === t ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <StatsGrid>
          <StatCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Helpful Actions</h3>
            <div className="text-3xl font-bold">
              {stats.helpfulActions.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Community Contributions</p>
            <div className="mt-4">
              <div className="text-sm">Knowledge Shared</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="font-semibold">{stats.knowledgeShared.topics}</div>
                  <div className="text-xs opacity-70">Topics</div>
                </div>
                <div>
                  <div className="font-semibold">{stats.knowledgeShared.resources}</div>
                  <div className="text-xs opacity-70">Resources</div>
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Cultural Impact</h3>
            <div className="text-3xl font-bold">
              {stats.culturalExchanges.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Cultural Exchanges</p>
            <div className="mt-4">
              <div className="text-sm">Languages Supported</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.languagesSupported.map(lang => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-opacity-20 bg-white rounded-full text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </StatCard>

          <StatCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Community Growth</h3>
            <div className="text-3xl font-bold">
              {stats.communityGrowth.newConnections.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">New Connections Made</p>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold">{stats.communityGrowth.collaborations}</div>
                  <div className="text-xs opacity-70">Collaborations</div>
                </div>
                <div>
                  <div className="font-semibold">{stats.communityGrowth.mentorships}</div>
                  <div className="text-xs opacity-70">Mentorships</div>
                </div>
              </div>
            </div>
          </StatCard>
        </StatsGrid>
      )}

      <motion.div
        className="mt-8 p-4 bg-opacity-10 bg-white rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Impact Areas</h3>
        <div className="flex flex-wrap gap-2">
          {impactAreas.map((area, index) => (
            <ImpactBadge
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {area.icon}
              <div>
                <div className="font-semibold">{area.title}</div>
                <div className="text-xs opacity-70">{area.description}</div>
              </div>
            </ImpactBadge>
          ))}
        </div>
      </motion.div>

      <ContributionTimeline>
        <h3 className="text-xl font-semibold mb-4">Recent Contributions</h3>
        <AnimatePresence>
          {contributions.map((contribution, index) => (
            <TimelineItem
              key={contribution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">
                    {contribution.type.charAt(0).toUpperCase() + contribution.type.slice(1)}
                  </h4>
                  <p className="text-sm opacity-70">{contribution.content}</p>
                  {contribution.languages && (
                    <div className="flex gap-2 mt-2">
                      {contribution.languages.map(lang => (
                        <span
                          key={lang}
                          className="text-xs bg-opacity-20 bg-white px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-70">
                    {new Date(contribution.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-green-400">
                    {contribution.recipientCount} people helped
                  </div>
                </div>
              </div>
            </TimelineItem>
          ))}
        </AnimatePresence>
      </ContributionTimeline>
    </ContributionsContainer>
  );
};

export default CommunityContributions;
