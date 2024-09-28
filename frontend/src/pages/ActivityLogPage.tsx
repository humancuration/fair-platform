// frontend/src/pages/ActivityLogPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  details: string;
}

const ActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/activity-log'); // Implement this endpoint
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activity log:', err);
      setError('Failed to load activity log. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <div>Loading activity log...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      {activities.length === 0 ? (
        <p>No recent activities.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <span className="font-semibold">{activity.action}</span>
                <span className="text-gray-500 text-sm">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 mt-2">{activity.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogPage;
