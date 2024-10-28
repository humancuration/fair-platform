import type { FC } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaPencilAlt } from 'react-icons/fa';

interface CollaborativeToolsProps {
  trackId: string;
  bpm: number;
}

export const CollaborativeTools: FC<CollaborativeToolsProps> = ({
  trackId,
  bpm,
}) => {
  const [showTools, setShowTools] = useState(false);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: showTools ? 0 : '100%' }}
      className="absolute top-0 left-0 h-full bg-black/50 backdrop-blur-md p-4"
    >
      <button
        type="button"
        onClick={() => setShowTools(!showTools)}
        className="absolute left-0 top-1/2 -translate-x-full transform rotate-90 bg-black/50 px-4 py-2 rounded-t-lg"
      >
        <FaUsers /> Collaborate
      </button>

      <div className="space-y-4">
        <div className="collaborative-annotations">
          <h3 className="flex items-center gap-2">
            <FaPencilAlt /> Annotations
          </h3>
          {/* Annotation tools */}
        </div>

        <div className="collaborative-chat">
          <h3 className="flex items-center gap-2">
            <FaComments /> Discussion
          </h3>
          {/* Chat interface */}
        </div>

        <div className="collaborative-remix">
          <h3>Remix Studio (BPM: {bpm})</h3>
          {/* Remix tools */}
        </div>
      </div>
    </motion.div>
  );
};
