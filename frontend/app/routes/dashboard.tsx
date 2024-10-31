import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/utils/auth.server";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";

interface LoaderData {
  user: User;
  stats: {
    totalProducts: number;
    totalRevenue: number;
    averageGenerosity: number;
    activeUsers: number;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  
  const stats = await db.analytics.findFirst({
    where: { userId: user.id },
    select: {
      totalProducts: true,
      totalRevenue: true,
      averageGenerosity: true,
      activeUsers: true,
    }
  });

  return json<LoaderData>({ user, stats });
};

export default function Dashboard() {
  const { user, stats } = useLoaderData<LoaderData>();

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Products"
            value={stats.totalProducts}
            icon="CubeIcon"
            color="text-blue-500"
          />
          {/* Add other metric cards */}
        </div>
      </div>
    </DashboardLayout>
  );
}
