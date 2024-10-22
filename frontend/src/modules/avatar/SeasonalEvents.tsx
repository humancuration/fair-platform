import React, { useState, useEffect } from 'react';
import api from '../../api/api';

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  unlockedItems: string[];
}

const SeasonalEvents: React.FC<{ userId: string }> = ({ userId }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/current');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleUnlockItem = async (eventId: string, itemId: string) => {
    try {
      await api.post(`/inventory`, { userId, itemId });
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, unlockedItems: event.unlockedItems.filter(id => id !== itemId) }
            : event
        )
      );
    } catch (error) {
      console.error('Error unlocking item:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Seasonal Events</h3>
      {events.map(event => (
        <div key={event.id} className="mb-2">
          <h4 className="font-semibold">{event.name}</h4>
          <p>Ends: {new Date(event.endDate).toLocaleDateString()}</p>
          <p>Unlockable Items:</p>
          <ul>
            {event.unlockedItems.map(itemId => (
              <li key={itemId}>
                {itemId}{' '}
                <button 
                  onClick={() => handleUnlockItem(event.id, itemId)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Unlock
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SeasonalEvents;
