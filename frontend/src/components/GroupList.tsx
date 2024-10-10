import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GroupCard from './GroupCard';

interface Group {
  _id: string;
  name: string;
  description: string;
  groupType: {
    name: string;
    description: string;
  };
  categoryBadge: string;
  profilePicture: string;
  members: { username: string }[];
  delegates: { username: string }[];
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <p>Loading groups...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </div>
  );
};

export default GroupList;