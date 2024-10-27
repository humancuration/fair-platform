import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { gql, useQuery } from '@apollo/client';
import DashboardGrid from '~/components/dashboard/DashboardGrid';
import DashboardCard from '~/components/dashboard/DashboardCard';
import GroupsOverviewSection from '~/components/dashboard/GroupsOverviewSection';
import { prisma } from '~/utils/db.server';

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      activeUsers
      totalRevenue
      pendingReports
    }
  }
`;

export async function loader() {
  const recentActivity = await prisma.activity.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return json({ recentActivity });
}

export default function DashboardIndex() {
  const { recentActivity } = useLoaderData<typeof loader>();
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <DashboardGrid columns={4} gap={6}>
        {data?.dashboardStats && Object.entries(data.dashboardStats).map(([key, value]) => (
          <DashboardCard
            key={key}
            title={key.replace(/([A-Z])/g, ' $1').trim()}
            loading={loading}
            error={error?.message}
          >
            <div className="text-3xl font-bold">
              {typeof value === 'number' && key.includes('Revenue')
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()}
            </div>
          </DashboardCard>
        ))}
      </DashboardGrid>

      <div className="mt-8">
        <GroupsOverviewSection />
      </div>

      <div className="mt-8">
        <DashboardCard title="Recent Activity">
          <ul className="divide-y">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex justify-between">
                  <span>{activity.description}</span>
                  <span className="text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}
