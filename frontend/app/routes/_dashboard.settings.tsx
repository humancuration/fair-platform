import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/utils/db.server';
import DashboardCard from '~/components/dashboard/DashboardCard';

export async function loader() {
  const settings = await prisma.userSettings.findFirst({
    where: {
      // Add user condition when auth is implemented
    },
  });

  return json({ settings });
}

export default function DashboardSettings() {
  const { settings } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Settings</h1>

      <DashboardCard title="Preferences">
        {/* Add settings form */}
      </DashboardCard>

      <DashboardCard title="Notifications">
        {/* Add notification settings */}
      </DashboardCard>

      <DashboardCard title="API Keys">
        {/* Add API key management */}
      </DashboardCard>
    </div>
  );
}
