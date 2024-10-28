import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { getPlaylist } from "~/models/playlist.server";
import { requireUserId } from "~/session.server";
import { PlaylistPlayer } from "~/components/playlist/PlaylistPlayer";
import { CollaborativeFeatures } from "~/components/playlist/CollaborativeFeatures";
import { AIDJMusicIntegration } from "~/components/music/AIDJMusicIntegration";
import { PlaylistVersionControl } from "~/components/playlist/PlaylistVersionControl";
import { usePlaylist } from "~/hooks/usePlaylist";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const playlist = await getPlaylist({ userId, id: params.id });
  if (!playlist) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ playlist });
};

export default function PlaylistDetailsPage() {
  const { playlist } = useLoaderData<typeof loader>();
  const { isPlaying, currentTrack } = usePlaylist();

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Playlist Content */}
        <div className="lg:col-span-2">
          <PlaylistPlayer playlist={playlist} />
          <CollaborativeFeatures playlistId={playlist.id} />
        </div>

        {/* AI DJ & Features */}
        <div>
          <AIDJMusicIntegration 
            mode="educational"
            allowCollaboration={true}
          />
          <PlaylistVersionControl playlistId={playlist.id} />
        </div>
      </div>

      {/* Quantum Visualization Layer */}
      {isPlaying && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={currentTrack?.artwork} 
                  alt={currentTrack?.title}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h3 className="font-bold">{currentTrack?.title}</h3>
                  <p className="text-sm opacity-70">{currentTrack?.artist}</p>
                </div>
              </div>
              {/* Add visualizer and controls here */}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
