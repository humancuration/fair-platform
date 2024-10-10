import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface SupportChannel {
  id: string;
  name: string;
  description: string;
  groupId: string;
}

const GroupSupportChannels: React.FC = () => {
  const [channels, setChannels] = useState<SupportChannel[]>([]);

  useEffect(() => {
    const fetchSupportChannels = async () => {
      try {
        const response = await api.get('/support/channels/groups');
        setChannels(response.data);
      } catch (error) {
        console.error('Error fetching group support channels:', error);
      }
    };

    fetchSupportChannels();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Group Support Channels</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id} className="border p-2 rounded mb-2">
            <h3 className="font-semibold">{channel.name}</h3>
            <p>{channel.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupSupportChannels;