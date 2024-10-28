import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import DashboardCard from './components/DashboardCard';
import DashboardGrid from './components/DashboardGrid';
import api from '../../utils/api';

interface GroupAnalytics {
  memberGrowth: {
    dates: string[];
    counts: number[];
  };
  resourceUsage: {
    labels: string[];
    values: number[];
  };
  activityMetrics: {
    posts: number;
    comments: number;
    reactions: number;
  };
  engagementRate: number;
}

const GroupAnalyticsDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/analytics`);
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load group analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [groupId]);

  const memberGrowthData = {
    labels: analytics?.memberGrowth.dates || [],
    datasets: [
      {
        label: 'Member Growth',
        data: analytics?.memberGrowth.counts || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const resourceUsageData = {
    labels: analytics?.resourceUsage.labels || [],
    datasets: [
      {
        label: 'Resource Usage',
        data: analytics?.resourceUsage.values || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Group Analytics</h1>
      
      <DashboardGrid columns={3}>
        <DashboardCard
          title="Member Growth"
          loading={loading}
          error={error}
        >
          <Line data={memberGrowthData} options={{ responsive: true }} />
        </DashboardCard>

        <DashboardCard
          title="Resource Usage"
          loading={loading}
          error={error}
        >
          <Bar data={resourceUsageData} options={{ responsive: true }} />
        </DashboardCard>

        <DashboardCard
          title="Activity Metrics"
          loading={loading}
          error={error}
        >
          {analytics && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics.activityMetrics.posts}</div>
                <div className="text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics.activityMetrics.comments}</div>
                <div className="text-gray-500">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics.activityMetrics.reactions}</div>
                <div className="text-gray-500">Reactions</div>
              </div>
            </div>
          )}
        </DashboardCard>
      </DashboardGrid>
    </div>
  );
};

export default GroupAnalyticsDashboard;
