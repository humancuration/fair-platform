import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, Outlet } from '@remix-run/react';
import { motion } from 'framer-motion';
import { requireUser } from '~/services/auth.server';
import { getDashboardData } from '~/services/dashboard.server';
import DashboardSidebar from '~/components/dashboard/DashboardSidebar';
import type { DashboardData } from '~/types';

interface LoaderData {
  dashboardData: DashboardData;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const dashboardData = await getDashboardData(user.id);
  return json<LoaderData>({ dashboardData });
};

export default function Dashboard() {
  const { dashboardData } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto"
        >
          <Outlet context={{ dashboardData }} />
        </motion.div>
      </main>
    </div>
  );
}
