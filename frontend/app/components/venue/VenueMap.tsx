import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as d3 from "d3";

interface Venue {
  id: string;
  name: string;
  type: "cafe" | "coworking" | "library" | "community" | "outdoor";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  amenities: string[];
  vibes: string[];
  currentOccupancy: number;
  maxOccupancy: number;
  rating: number;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
}

const venueColors = {
  cafe: "#10B981",        // Green
  coworking: "#8B5CF6",   // Purple
  library: "#3B82F6",     // Blue
  community: "#EC4899",   // Pink
  outdoor: "#F59E0B"      // Orange
};

const venueEmojis = {
  cafe: "☕",
  coworking: "💻",
  library: "📚",
  community: "🏛️",
  outdoor: "🌳"
};

const funMessages = {
  checkin: ["Welcome to your new spot! ✨", "Vibing in progress! 🎵", "Found your flow space! 🌊"],
  review: ["Thanks for sharing! 💫", "Community insights! 🔍", "Helping others find their spot! 🎯"],
  favorite: ["Spot saved! 💖", "Added to your collection! ✨", "Great taste bestie! 🌟"]
};

export function VenueMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (!mapRef.current || !fetcher.data) return;

    const svg = d3.select(mapRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, 800, 600]);

    // D3 visualization code here
    // Similar to CreativityWeb pattern:
    return () => {
        svg.remove();
      };
    }, [fetcher.data]);
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Community Spaces ✨</h2>
  
        <div
          ref={mapRef}
          className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner"
        />
  
        <AnimatePresence>
          {hoveredVenue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute pointer-events-none bg-white p-4 rounded-lg shadow-lg"
              style={{
                left: `${hoveredVenue.location.lng}px`,
                top: `${hoveredVenue.location.lat}px`
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{venueEmojis[hoveredVenue.type]}</span>
                <h3 className="font-bold">{hoveredVenue.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{hoveredVenue.location.address}</p>
              <div className="mt-2 flex gap-1">
                {hoveredVenue.vibes.map(vibe => (
                  <span key={vibe} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    #{vibe}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        <AnimatePresence>
          {selectedVenue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${venueColors[selectedVenue.type]}20` }}
                    >
                      {venueEmojis[selectedVenue.type]}
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedVenue.name}</h3>
                      <p className="text-sm text-gray-500">Added by {selectedVenue.creator.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
  
                {/* Occupancy Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Current Occupancy</span>
                    <span>{selectedVenue.currentOccupancy}/{selectedVenue.maxOccupancy}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(selectedVenue.currentOccupancy / selectedVenue.maxOccupancy) * 100}%` 
                      }}
                    />
                  </div>
                </div>
  
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedVenue.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
  
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                    onClick={() => {
                      fetcher.submit(
                        { venueId: selectedVenue.id, intent: "checkin" },
                        { method: "post" }
                      );
                    }}
                  >
                    Check In Here ✨
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
