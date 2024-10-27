import { Link } from '@remix-run/react';
import DashboardCard from './DashboardCard';
import GroupDashboardCard from './GroupDashboardCard';
import type { Group } from '~/types/dashboard';

interface GroupsOverviewSectionProps {
  groups: Group[];
  loading?: boolean;
}

export default function GroupsOverviewSection({ groups, loading }: GroupsOverviewSectionProps) {
  return (
    <DashboardCard title="Your Groups" loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.slice(0, 6).map(group => (
          <GroupDashboardCard key={group.id} group={group} />
        ))}
      </div>
      
      {groups.length > 6 && (
        <div className="mt-4 text-center">
          <Link 
            to="/groups" 
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All Groups ({groups.length})
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}
