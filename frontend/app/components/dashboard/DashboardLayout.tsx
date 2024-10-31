import { Outlet } from "@remix-run/react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
