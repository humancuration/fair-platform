import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaCompactDisc, FaGlobe, FaUserFriends, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

interface ArtistGrowth {
  artistId: string;
  name: string;
  avatar: string;
  initialListeners: number;
  currentListeners: number;
  growthPercentage: number;
  firstFeatureDate: string;
  genres: string[];
}

interface PlaylistImpact {
  totalListeners: number;
  uniqueArtistsPromoted: number;
  crossGenreCollaborations: number;
  listenerRetention: number;
  geographicReach: {
    countries: number;
    topRegions: {
      name: string;
      listeners: number;
    }[];
  };
  communityEngagement: {
    comments: number;
    shares: number;
    saves: number;
    collaborations: number;
  };
}

const ImpactContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ImpactCard = styled(motion.div)`
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

const ArtistCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const AchievementBadge = styled(motion.div)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border-radius: 25px;
  padding: 8px 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 5px;
  font-size: 0.9rem;
`;

const CuratorImpact: React.FC<{ curatorId: string }> = ({ curatorId }) => {
  const [impact, setImpact] = useState<PlaylistImpact | null>(null);
  const [growthData, setGrowthData] = useState<ArtistGrowth[]>([]);
  const [timeframe, setTimeframe] = useState<'month' | 'year' | 'all'>('month');

  useEffect(() => {
    fetchImpactData();
    fetchArtistGrowth();
  }, [timeframe]);

  const fetchImpactData = async () => {
    try {
      const response = await fetch(`/api/curators/${curatorId}/impact?timeframe=${timeframe}`);
      const data = await response.json();
      setImpact(data);
    } catch (error) {
      console.error('Failed to fetch impact data:', error);
      toast.error('Could not load impact data');
    }
  };

  const fetchArtistGrowth = async () => {
    try {
      const response = await fetch(`/api/curators/${curatorId}/artist-growth?timeframe=${timeframe}`);
      const data = await response.json();
      setGrowthData(data);
    } catch (error) {
      console.error('Failed to fetch artist growth:', error);
      toast.error('Could not load artist growth data');
    }
  };

  const achievements = [
    { icon: <FaGlobe />, title: 'Global Reach', description: 'Playlists played in 50+ countries' },
    { icon: <FaCompactDisc />, title: 'Genre Explorer', description: 'Connected 10+ music genres' },
    { icon: <FaUserFriends />, title: 'Artist Supporter', description: 'Helped 100+ emerging artists' },
    { icon: <FaLightbulb />, title: 'Trend Setter', description: '5 playlists in trending' }
  ];

  return (
    <ImpactContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaStar className="text-yellow-400" /> Curator Impact
        </h2>
        <div className="flex gap-2">
          {['month', 'year', 'all'].map((t) => (
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

      {impact && (
        <ImpactGrid>
          <ImpactCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Listener Impact</h3>
            <div className="text-3xl font-bold">
              {impact.totalListeners.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Total Listeners Reached</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Retention Rate</span>
                <span>{impact.listenerRetention}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full mt-1">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${impact.listenerRetention}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </ImpactCard>

          <ImpactCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Artist Growth</h3>
            <div className="text-3xl font-bold">
              {impact.uniqueArtistsPromoted.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Artists Promoted</p>
            <div className="mt-4">
              <div className="text-sm">Top Growing Artists</div>
              {growthData.slice(0, 3).map((artist) => (
                <ArtistCard
                  key={artist.artistId}
                  whileHover={{ x: 5 }}
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{artist.name}</div>
                    <div className="text-sm text-green-400">
                      +{artist.growthPercentage}% growth
                    </div>
                  </div>
                </ArtistCard>
              ))}
            </div>
          </ImpactCard>

          <ImpactCard whileHover={{ scale: 1.02 }}>
            <h3 className="font-semibold mb-2">Global Reach</h3>
            <div className="text-3xl font-bold">
              {impact.geographicReach.countries}
            </div>
            <p className="text-sm opacity-70">Countries Reached</p>
            <div className="mt-4">
              <div className="text-sm">Top Regions</div>
              {impact.geographicReach.topRegions.map((region) => (
                <div
                  key={region.name}
                  className="flex justify-between items-center mt-2"
                >
                  <span>{region.name}</span>
                  <span>{region.listeners.toLocaleString()} listeners</span>
                </div>
              ))}
            </div>
          </ImpactCard>
        </ImpactGrid>
      )}

      <motion.div
        className="mt-8 p-4 bg-opacity-10 bg-white rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {achievement.icon}
              <div>
                <div className="font-semibold">{achievement.title}</div>
                <div className="text-xs opacity-70">{achievement.description}</div>
              </div>
            </AchievementBadge>
          ))}
        </div>
      </motion.div>

      {impact?.communityEngagement && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold mb-4">Community Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(impact.communityEngagement).map(([key, value]) => (
              <div
                key={key}
                className="bg-opacity-10 bg-white rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm opacity-70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </ImpactContainer>
  );
};

export default CuratorImpact;
