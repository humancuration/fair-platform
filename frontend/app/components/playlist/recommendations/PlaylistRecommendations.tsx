import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagic, FaPlus } from "react-icons/fa";
import { getPlaylistRecommendations } from "~/models/recommendations.server";
import type { RecommendedTrack } from "~/types/playlist";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.playlistId) throw new Error("Playlist ID is required");
  const recommendations = await getPlaylistRecommendations(params.playlistId);
  return json({ recommendations });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, trackId } = Object.fromEntries(formData);

  if (action === "addToQueue") {
    // Handle adding track to queue
    // This would typically update the playlist's queue in the database
  }

  return json({ success: true });
};

export function PlaylistRecommendations() {
  const { recommendations } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [activeRecommendations, setActiveRecommendations] = 
    useState<RecommendedTrack[]>(recommendations);

  const handleAddTrack = (track: RecommendedTrack) => {
    fetcher.submit(
      { action: "addToQueue", trackId: track.id },
      { method: "post" }
    );
    
    // Optimistic UI update
    setActiveRecommendations(prev => 
      prev.filter(t => t.id !== track.id)
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl mb-4 flex items-center gap-2">
        <FaMagic /> Magical Recommendations
      </h2>
      
      <AnimatePresence mode="popLayout">
        {activeRecommendations.map((track) => (
          <RecommendationCard
            key={track.id}
            track={track}
            onAdd={handleAddTrack}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function RecommendationCard({ 
  track, 
  onAdd 
}: { 
  track: RecommendedTrack; 
  onAdd: (track: RecommendedTrack) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white/5 rounded-lg p-4 mb-4 flex justify-between items-center"
    >
      <div>
        <h3>{track.title}</h3>
        <p className="text-sm opacity-70">{track.reason}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`
          px-2 py-1 rounded-full text-xs
          ${track.confidence > 80 ? 'bg-green-500/20' : 
            track.confidence > 60 ? 'bg-yellow-500/20' : 
            'bg-red-500/20'}
        `}>
          {track.confidence}% Match
        </span>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAdd(track)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <FaPlus />
        </motion.button>
      </div>
    </motion.div>
  );
}
