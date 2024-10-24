import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchUserGroups } from '../../../store/slices/groupsSlice';
import GroupDashboardCard from './GroupDashboardCard';
import DashboardCard from './DashboardCard';

const GroupsOverviewSection: React.FC = () => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state: RootState) => state.groups);
  const [activeGroups, setActiveGroups] = useState([]);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  return (
    <DashboardCard
      title="Your Groups"
      loading={loading}
      error={error}
    >
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
};

export default GroupsOverviewSection;
