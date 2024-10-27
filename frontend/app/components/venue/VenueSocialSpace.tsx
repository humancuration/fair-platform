import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FairVenue, VenueZone } from '../../types/venue/VenueTypes';
import VenueCard from './VenueCard';
import { useWebSocket } from '~/hooks/useWebSocket';

interface VenueSocialSpaceProps {
  venue: FairVenue;
  onZoneSelect?: (zone: VenueZone) => void;
}

const VenueSocialSpace: React.FC<VenueSocialSpaceProps> = ({ venue, onZoneSelect }) => {
  const [activeZones, setActiveZones] = useState<VenueZone[]>([]);
  const [participants, setParticipants] = useState<Array<{id: string, name: string}>>([]);
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on('zone_update', (zones: VenueZone[]) => {
        setActiveZones(zones);
      });

      socket.on('participants_update', (newParticipants) => {
        setParticipants(newParticipants);
      });
    }
  }, [socket]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeZones.map(zone => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4">{zone.name}</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Capacity</span>
                <span>{zone.capacity.optimal}/{zone.capacity.maximum}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {zone.musicStyles.map(style => (
                  <span key={style} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onZoneSelect?.(zone)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
              >
                Join Zone
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-full shadow-lg px-6 py-3"
        >
          <span className="font-bold">{participants.length} participants online</span>
        </motion.div>
      </div>
    </div>
  );
};

export default VenueSocialSpace;
