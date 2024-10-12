import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@api/api';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import ManageMembers from './ManageMembers';
import Calendar from './Calendar';

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
  events: any[];
}
const EventList: React.FC = () => <div>Event List Placeholder</div>;
const CreateEvent: React.FC = () => <div>Create Event Placeholder</div>;
const ManageMembers: React.FC = () => <div>Manage Members Placeholder</div>;

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.get(`/groups/${id}`);
        setGroup(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching group:', error);
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  if (loading) {
    return <p>Loading group...</p>;
  }

  if (!group) {
    return <p>Group not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
      {/* Group details */}
      {/* ... (rest of the component code) ... */}

      {/* Calendar */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Group Calendar</h2>
        <Calendar groupId={group._id} />
      </div>

      {/* ... other components */}
    </div>
  );
};

export default GroupDetail;