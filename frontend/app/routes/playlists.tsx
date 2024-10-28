import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaPlus, FaMagic, FaUsers, FaBrain } from "react-icons/fa";
import { getPlaylists } from "~/models/playlist.server";
import { requireUserId } from "~/session.server";
import { PlaylistCard } from "~/components/playlist/PlaylistCard";
import { CollectiveInsights } from "~/components/playlist/CollectiveInsights";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const playlists = await getPlaylists({ userId });
  return json({ playlists });
};

export default function PlaylistsPage() {
  const { playlists } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-screen">
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Collective Playlists</h1>
          <div className="flex gap-4">
            <Link
              to="new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90"
            >
              <FaPlus /> Create Playlist
            </Link>
            <Link
              to="ai"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg hover:opacity-90"
            >
              <FaBrain /> AI Curator
            </Link>
          </div>
        </div>

        <CollectiveInsights />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </motion.div>
      <Outlet />
    </div>
  );
}
