import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaComments, FaLightbulb, FaPuzzlePiece } from "react-icons/fa";
import { useCollaboration } from "~/hooks/useCollaboration";
import { CollaborativeChat } from "./CollaborativeChat";
import { SuggestionPanel } from "./SuggestionPanel";

interface CollaborativeFeaturesProps {
  playlistId: string;
}

export function CollaborativeFeatures({ playlistId }: CollaborativeFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'challenges'>('chat');
  const { collaborators, onlineUsers } = useCollaboration(playlistId);

  return (
    <div className="mt-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Collaborative Space</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">{onlineUsers.length} online</span>
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 3).map(user => (
              <img 
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-purple-900"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {[
          { id: 'chat', icon: FaComments, label: 'Chat' },
          { id: 'suggestions', icon: FaLightbulb, label: 'Suggestions' },
          { id: 'challenges', icon: FaPuzzlePiece, label: 'Challenges' }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tab.id ? 'bg-purple-500' : 'bg-white/10'
            }`}
          >
            <tab.icon />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'chat' && (
          <CollaborativeChat playlistId={playlistId} />
        )}
        {activeTab === 'suggestions' && (
          <SuggestionPanel playlistId={playlistId} />
        )}
        {activeTab === 'challenges' && (
          <div>Challenges coming soon!</div>
        )}
      </AnimatePresence>
    </div>
  );
}
