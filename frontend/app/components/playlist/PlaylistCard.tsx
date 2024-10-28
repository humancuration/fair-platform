import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaMusic, FaUsers, FaBrain, FaGraduationCap } from "react-icons/fa";
import type { Playlist, Contributor } from "~/types/playlist";

interface PlaylistCardData {
  playlist: Playlist;
  contributors: Contributor[];
  stats: {
    likes: number;
    shares: number;
    activeCollaborators: number;
  };
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const playlistData = await getPlaylistCardData(params.playlistId);
  return json({ playlistData });
};

export function PlaylistCard() {
  const { playlistData } = useLoaderData<typeof loader>();
  const { playlist, contributors, stats } = playlistData;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{playlist.title}</h3>
        <div className="flex gap-2">
          {playlist.isCollaborative && (
            <span className="bg-purple-500/20 p-1 rounded" title="Collaborative Playlist">
              <FaUsers />
            </span>
          )}
          {playlist.hasAICuration && (
            <span className="bg-blue-500/20 p-1 rounded" title="AI Curated">
              <FaBrain />
            </span>
          )}
          {playlist.isEducational && (
            <span className="bg-green-500/20 p-1 rounded" title="Educational Content">
              <FaGraduationCap />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <FaMusic className="text-2xl" />
        </div>
        <div>
          <p className="text-sm opacity-70">{playlist.tracks.length} tracks</p>
          <p className="text-sm opacity-70">{stats.activeCollaborators} active contributors</p>
        </div>
      </div>

      <div className="space-y-2">
        {contributors.slice(0, 3).map(contributor => (
          <div key={contributor.id} className="flex items-center gap-2">
            <img 
              src={contributor.avatar} 
              alt={contributor.name}
              className="w-6 h-6 rounded-full" 
            />
            <span className="text-sm">{contributor.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Link 
          to={`/playlists/${playlist.id}`}
          className="text-sm hover:underline"
        >
          Explore Playlist →
        </Link>
        <div className="flex gap-2">
          <span className="text-sm opacity-70">{stats.likes} likes</span>
          <span className="text-sm opacity-70">·</span>
          <span className="text-sm opacity-70">{stats.shares} shares</span>
        </div>
      </div>
    </motion.div>
  );
}
