import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaHeart, FaChartLine, FaBrain, FaMusic, FaStar, FaCertificate } from 'react-icons/fa';
import { moodAnalysisService } from '../../../services/MoodAnalysisService';
import { usePlaylist } from '../../../contexts/PlaylistContext';

interface CuratorStats {
  totalPlaylists: number;
  totalFollowers: number;
  averageRating: number;
  genreExpertise: {
    genre: string;
    score: number;
  }[];
  moodAccuracy: number;
  successfulRecommendations: number;
  collaborations: {
    ai: number;
    human: number;
  };
  verificationLevel: number;
  specializations: string[];
}

interface MoodAnalysis {
  consistency: number;
  uniqueness: number;
  emotionalRange: number;
  genreBlending: number;
  transitionQuality: number;
}

const ProfileContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const CuratorHeader = styled.div<{ type: 'ai' | 'human' | 'hybrid' }>`
  background: ${({ type }) => 
    type === 'ai' 
      ? 'linear-gradient(135deg, #6e48aa, #9d50bb)'
      : type === 'hybrid'
      ? 'linear-gradient(135deg, #43cea2, #185a9d)'
      : 'linear-gradient(135deg, #ff6b6b, #feca57)'};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
`;

const ExpertiseChart = styled(motion.div)`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const VerificationBadge = styled(motion.div)<{ level: number }>`
  background: ${({ level }) => {
    if (level >= 8) return 'linear-gradient(45deg, #FFD700, #FFA500)';
    if (level >= 5) return 'linear-gradient(45deg, #C0C0C0, #808080)';
    return 'linear-gradient(45deg, #CD7F32, #8B4513)';
  }};
  padding: 5px 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PlaylistCuratorProfile: React.FC<{
  curatorId: string;
  type: 'ai' | 'human' | 'hybrid';
}> = ({ curatorId, type }) => {
  const [stats, setStats] = useState<CuratorStats | null>(null);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchCuratorStats();
    analyzeCuratorStyle();
  }, [curatorId]);

  const fetchCuratorStats = async () => {
    try {
      const response = await fetch(`/api/curators/${curatorId}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch curator stats:', error);
    }
  };

  const analyzeCuratorStyle = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/curators/${curatorId}/playlists`);
      const playlists = await response.json();
      
      // Analyze mood patterns across all playlists
      const analyses = await Promise.all(
        playlists.map(async (playlist: any) => {
          const analysis = await moodAnalysisService.analyzePlaylistMood(playlist);
          return analysis;
        })
      );

      // Calculate overall mood analysis metrics
      setMoodAnalysis({
        consistency: calculateConsistency(analyses),
        uniqueness: calculateUniqueness(analyses),
        emotionalRange: calculateEmotionalRange(analyses),
        genreBlending: calculateGenreBlending(analyses),
        transitionQuality: calculateTransitionQuality(analyses)
      });
    } catch (error) {
      console.error('Failed to analyze curator style:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateConsistency = (analyses: any[]) => {
    // Calculate how consistent the curator's playlist moods are
    return 0.85; // Placeholder
  };

  const calculateUniqueness = (analyses: any[]) => {
    // Calculate how unique the curator's selections are compared to popular trends
    return 0.75; // Placeholder
  };

  const calculateEmotionalRange = (analyses: any[]) => {
    // Calculate the range of emotions covered in playlists
    return 0.92; // Placeholder
  };

  const calculateGenreBlending = (analyses: any[]) => {
    // Calculate how well different genres are mixed
    return 0.88; // Placeholder
  };

  const calculateTransitionQuality = (analyses: any[]) => {
    // Calculate how smooth the transitions between songs are
    return 0.95; // Placeholder
  };

  if (!stats) return null;

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CuratorHeader type={type}>
        <div className="flex items-center gap-4">
          {type === 'ai' ? (
            <FaRobot className="text-4xl" />
          ) : type === 'hybrid' ? (
            <FaBrain className="text-4xl" />
          ) : (
            <FaUser className="text-4xl" />
          )}
          <div>
            <h2 className="text-2xl font-bold">Curator Profile</h2>
            <VerificationBadge 
              level={stats.verificationLevel}
              whileHover={{ scale: 1.05 }}
            >
              <FaCertificate />
              Level {stats.verificationLevel} Verified
            </VerificationBadge>
          </div>
        </div>
      </CuratorHeader>

      <StatsGrid>
        <StatCard whileHover={{ scale: 1.05 }}>
          <FaMusic className="text-2xl mb-2" />
          <div className="text-2xl font-bold">{stats.totalPlaylists}</div>
          <div className="text-sm opacity-70">Playlists Created</div>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }}>
          <FaHeart className="text-2xl mb-2" />
          <div className="text-2xl font-bold">{stats.totalFollowers}</div>
          <div className="text-sm opacity-70">Followers</div>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }}>
          <FaStar className="text-2xl mb-2" />
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <div className="text-sm opacity-70">Average Rating</div>
        </StatCard>

        <StatCard whileHover={{ scale: 1.05 }}>
          <FaChartLine className="text-2xl mb-2" />
          <div className="text-2xl font-bold">{stats.successfulRecommendations}</div>
          <div className="text-sm opacity-70">Successful Recommendations</div>
        </StatCard>
      </StatsGrid>

      {moodAnalysis && (
        <ExpertiseChart>
          <h3 className="text-xl font-bold mb-4">Curation Style Analysis</h3>
          <div className="space-y-4">
            {Object.entries(moodAnalysis).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span>{(value * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ExpertiseChart>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Genre Expertise</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.genreExpertise.map(genre => (
            <div
              key={genre.genre}
              className="bg-opacity-10 bg-white rounded p-3"
            >
              <div className="flex justify-between mb-1">
                <span>{genre.genre}</span>
                <span>{genre.score.toFixed(1)}/10</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(genre.score / 10) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {type === 'ai' && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">AI Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {stats.specializations.map(spec => (
              <span
                key={spec}
                className="px-3 py-1 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
    </ProfileContainer>
  );
};

export default PlaylistCuratorProfile;
