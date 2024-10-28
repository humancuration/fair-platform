import { useState } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo } from "react-icons/fa";
import type { Track } from "~/types/playlist";
import { WaveformVisualizer } from "~/components/visualizers/WaveformVisualizer";
import { QuantumVisualizer } from "~/components/visualizers/QuantumVisualizer";

interface PlaylistData {
  id: string;
  tracks: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const playlistData = await getPlaylistData(params.playlistId);
  return json({ playlistData });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");
  const playlistId = formData.get("playlistId");

  switch (action) {
    case "play":
      await togglePlayState(playlistId as string);
      break;
    case "next":
      await skipToNextTrack(playlistId as string);
      break;
    case "previous":
      await skipToPreviousTrack(playlistId as string);
      break;
    case "shuffle":
      await toggleShuffleMode(playlistId as string);
      break;
    case "repeat":
      await toggleRepeatMode(playlistId as string);
      break;
  }

  return json({ success: true });
};

export function PlaylistPlayer() {
  const [visualizerMode, setVisualizerMode] = useState<'waveform' | 'quantum'>('waveform');
  const { playlistData } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const currentTrack = playlistData.tracks.find(t => t.id === playlistData.currentTrackId);

  const handleAction = (action: string) => {
    fetcher.submit(
      { 
        action,
        playlistId: playlistData.id 
      },
      { method: "post" }
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="relative h-64 mb-6">
        <AnimatePresence mode="wait">
          {visualizerMode === 'waveform' ? (
            <WaveformVisualizer 
              key="waveform" 
              track={currentTrack}
              isPlaying={playlistData.isPlaying}
            />
          ) : (
            <QuantumVisualizer 
              key="quantum"
              track={currentTrack}
              isPlaying={playlistData.isPlaying}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold">{currentTrack?.title}</h3>
          <p className="text-sm opacity-70">{currentTrack?.artist}</p>
        </div>
        <button
          onClick={() => setVisualizerMode(prev => 
            prev === 'waveform' ? 'quantum' : 'waveform'
          )}
          className="px-4 py-2 bg-white/10 rounded-lg text-sm"
        >
          Switch Visualizer
        </button>
      </div>

      <div className="flex justify-center items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction("shuffle")}
          className={`p-2 rounded-full ${playlistData.shuffleEnabled ? 'bg-purple-500' : 'bg-white/10'}`}
        >
          <FaRandom />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction("previous")}
          className="p-2 rounded-full bg-white/10"
        >
          <FaStepBackward />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAction("play")}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
        >
          {playlistData.isPlaying ? <FaPause /> : <FaPlay />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction("next")}
          className="p-2 rounded-full bg-white/10"
        >
          <FaStepForward />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAction("repeat")}
          className={`p-2 rounded-full ${playlistData.repeatEnabled ? 'bg-purple-500' : 'bg-white/10'}`}
        >
          <FaRedo />
        </motion.button>
      </div>
    </div>
  );
}
