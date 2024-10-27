import { BarChart2, TrendingUp, Users, DollarSign } from 'react-feather';
import DashboardCard from '../DashboardCard';
import AnalyticsChart from './AnalyticsChart';
import type { AnalyticsData } from '~/types/dashboard';

interface AnalyticsPageProps {
  data: AnalyticsData;
  loading?: boolean;
}

export default function AnalyticsPage({ data, loading }: AnalyticsPageProps) {
  const metrics = [
    {
      title: 'Total Products',
      value: data.totalProducts,
      icon: BarChart2,
      color: 'text-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Average Generosity',
      value: `${data.averageGenerosity.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Active Users',
      value: data.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(({ title, value, icon: Icon, color }) => (
          <DashboardCard key={title} title={title} loading={loading}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Revenue Trend" loading={loading}>
          <AnalyticsChart
            data={data.revenueTrend}
            type="line"
            height={300}
          />
        </DashboardCard>

        <DashboardCard title="User Growth" loading={loading}>
          <AnalyticsChart
            data={data.userGrowth}
            type="bar"
            height={300}
          />
        </DashboardCard>
      </div>
    </div>
  );
}
