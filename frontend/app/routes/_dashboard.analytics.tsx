import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { gql, useQuery } from '@apollo/client';
import { prisma } from '~/utils/db.server';
import AnalyticsPage from '~/components/dashboard/analytics/AnalyticsPage';

const GET_ANALYTICS_DATA = gql`
  query GetAnalyticsData {
    analyticsData {
      totalProducts
      totalRevenue
      averageGenerosity
    }
  }
`;

export async function loader() {
  const analyticsData = await prisma.analytics.findFirst({
    where: {
      // Add your conditions
    },
  });

  return json({ analyticsData });
}

export default function AnalyticsDashboard() {
  const { analyticsData } = useLoaderData<typeof loader>();
  const { data, loading } = useQuery(GET_ANALYTICS_DATA);

  return (
    <AnalyticsPage 
      data={data?.analyticsData || analyticsData}
      loading={loading}
    />
  );
}
