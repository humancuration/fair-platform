import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaHeart, FaFire, FaBrain, FaGem, FaChartLine, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Curator {
  id: string;
  name: string;
  type: 'ai' | 'human' | 'hybrid';
  avatar: string;
  bio: string;
  stats: {
    followers: number;
    totalPlaylists: number;
    averageRating: number;
    monthlyListeners: number;
  };
  specialties: string[];
  recentPlaylists: {
    id: string;
    name: string;
    likes: number;
    plays: number;
  }[];
  curatorScore: number;
  badges: {
    type: string;
    label: string;
    description: string;
  }[];
  aiFeatures?: {
    modelType: string;
    capabilities: string[];
    trustScore: number;
    verificationStatus: 'verified' | 'experimental' | 'learning';
  };
}

const DiscoveryContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  background: ${({ active }) => 
    active ? 'linear-gradient(45deg, #43cea2, #185a9d)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CuratorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const CuratorCard = styled(motion.div)<{ type: 'ai' | 'human' | 'hybrid' }>`
  background: ${({ type }) => 
    type === 'ai' 
      ? 'linear-gradient(135deg, #6e48aa, #9d50bb)'
      : type === 'hybrid'
      ? 'linear-gradient(135deg, #43cea2, #185a9d)'
      : 'linear-gradient(135deg, #ff6b6b, #feca57)'};
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Badge = styled(motion.span)`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TrendingSection = styled(motion.div)`
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const CuratorDiscovery: React.FC = () => {
  const [curators, setCurators] = useState<Curator[]>([]);
  const [filter, setFilter] = useState<'all' | 'ai' | 'human' | 'hybrid' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'followers' | 'innovative'>('rating');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurators();
  }, [filter, sortBy]);

  const fetchCurators = async () => {
    try {
      const response = await fetch(`/api/curators?filter=${filter}&sort=${sortBy}`);
      const data = await response.json();
      setCurators(data);
    } catch (error) {
      console.error('Failed to fetch curators:', error);
      toast.error('Could not load curators');
    }
  };

  const handleFollow = async (curatorId: string) => {
    try {
      await fetch(`/api/curators/${curatorId}/follow`, { method: 'POST' });
      toast.success('Following curator!');
      fetchCurators(); // Refresh data
    } catch (error) {
      toast.error('Failed to follow curator');
    }
  };

  const renderTrendingCurators = () => (
    <TrendingSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaFire className="text-orange-500" /> Trending Curators
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {curators
          .sort((a, b) => b.stats.monthlyListeners - a.stats.monthlyListeners)
          .slice(0, 3)
          .map(curator => (
            <motion.div
              key={curator.id}
              className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={curator.avatar}
                  alt={curator.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{curator.name}</h3>
                  <p className="text-sm opacity-80">
                    {curator.stats.monthlyListeners.toLocaleString()} monthly listeners
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </TrendingSection>
  );

  return (
    <DiscoveryContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {filter === 'all' && renderTrendingCurators()}

      <FilterSection>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGem /> All Curators
        </FilterButton>
        <FilterButton
          active={filter === 'ai'}
          onClick={() => setFilter('ai')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRobot /> AI Curators
        </FilterButton>
        <FilterButton
          active={filter === 'human'}
          onClick={() => setFilter('human')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUser /> Human Curators
        </FilterButton>
        <FilterButton
          active={filter === 'hybrid'}
          onClick={() => setFilter('hybrid')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBrain /> Hybrid Curators
        </FilterButton>
        <FilterButton
          active={filter === 'trending'}
          onClick={() => setFilter('trending')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChartLine /> Trending
        </FilterButton>
      </FilterSection>

      <CuratorGrid>
        <AnimatePresence>
          {curators.map(curator => (
            <CuratorCard
              key={curator.id}
              type={curator.type}
              onClick={() => navigate(`/curator/${curator.id}`)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={curator.avatar}
                    alt={curator.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{curator.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      {curator.type === 'ai' && <FaRobot />}
                      {curator.type === 'hybrid' && <FaBrain />}
                      {curator.type === 'human' && <FaUser />}
                      <span>{curator.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{curator.curatorScore.toFixed(1)}</span>
                  </div>
                  <div className="text-sm opacity-80">Curator Score</div>
                </div>
              </div>

              <p className="mt-4 text-sm opacity-90">{curator.bio}</p>

              <BadgeContainer>
                {curator.badges.map(badge => (
                  <Badge
                    key={badge.type}
                    whileHover={{ scale: 1.1 }}
                    title={badge.description}
                  >
                    <FaGem /> {badge.label}
                  </Badge>
                ))}
              </BadgeContainer>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Followers</div>
                  <div className="font-bold">
                    {curator.stats.followers.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="opacity-80">Playlists</div>
                  <div className="font-bold">{curator.stats.totalPlaylists}</div>
                </div>
              </div>

              {curator.type === 'ai' && curator.aiFeatures && (
                <div className="mt-4 p-3 bg-black bg-opacity-20 rounded-lg">
                  <div className="text-sm font-semibold mb-2">AI Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    {curator.aiFeatures.capabilities.map(cap => (
                      <span
                        key={cap}
                        className="px-2 py-1 bg-purple-500 bg-opacity-20 rounded-full text-xs"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CuratorCard>
          ))}
        </AnimatePresence>
      </CuratorGrid>
    </DiscoveryContainer>
  );
};

export default CuratorDiscovery;
