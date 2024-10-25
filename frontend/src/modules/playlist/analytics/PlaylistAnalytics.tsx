import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FaChartLine, FaClock, FaHeadphones, FaShare } from 'react-icons/fa';
import { formatDuration } from '../../../utils/formatters';

interface PlaylistStats {
  playCount: number;
  totalDuration: number;
  uniqueListeners: number;
  shareCount: number;
  listenerHistory: {
    date: string;
    count: number;
  }[];
}

const AnalyticsContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0;
  background: linear-gradient(45deg, #43cea2, #185a9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PlaylistAnalytics: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [stats, setStats] = useState<PlaylistStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/playlists/${playlistId}/analytics`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [playlistId]);

  if (loading || !stats) {
    return <div>Loading analytics...</div>;
  }

  const chartData = {
    labels: stats.listenerHistory.map(h => h.date),
    datasets: [
      {
        label: 'Listeners',
        data: stats.listenerHistory.map(h => h.count),
        fill: true,
        borderColor: '#43cea2',
        backgroundColor: 'rgba(67, 206, 162, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <AnalyticsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl mb-4">Playlist Analytics</h2>
      <StatsGrid>
        <StatCard whileHover={{ scale: 1.05 }}>
          <FaHeadphones />
          <StatValue>{stats.playCount}</StatValue>
          <div>Total Plays</div>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <FaClock />
          <StatValue>{formatDuration(stats.totalDuration)}</StatValue>
          <div>Total Duration</div>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <FaChartLine />
          <StatValue>{stats.uniqueListeners}</StatValue>
          <div>Unique Listeners</div>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <FaShare />
          <StatValue>{stats.shareCount}</StatValue>
          <div>Times Shared</div>
        </StatCard>
      </StatsGrid>

      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </AnalyticsContainer>
  );
};

export default PlaylistAnalytics;
