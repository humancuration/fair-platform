import React from 'react';
import { motion } from 'framer-motion';
import { FairVenue } from '../../types/venue/VenueTypes';

interface VenueCardProps {
  venue: FairVenue;
  onClick?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl">
          {venue.name[0]}
        </div>
        <div>
          <h3 className="text-xl font-bold">{venue.name}</h3>
          <p className="text-gray-600">{venue.type}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Accessibility Features */}
        <div className="flex flex-wrap gap-2">
          {venue.accessibility.languages.map(lang => (
            <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {lang}
            </span>
          ))}
        </div>

        {/* Resources */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-bold">{venue.resources.computePower}</div>
            <div className="text-xs text-gray-600">Compute</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-bold">{venue.resources.storageSpace}</div>
            <div className="text-xs text-gray-600">Storage</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-bold">{venue.resources.bandwidth}</div>
            <div className="text-xs text-gray-600">Bandwidth</div>
          </div>
        </div>

        {/* Vibes */}
        <div className="flex flex-wrap gap-2">
          {venue.vibes.map(vibe => (
            <span key={vibe} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              #{vibe}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;
