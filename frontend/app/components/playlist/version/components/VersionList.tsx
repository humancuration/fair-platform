import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaCodeBranch, FaMagic, FaHistory } from "react-icons/fa";
import type { PlaylistVersion } from "~/types/version";

interface VersionListProps {
  versions: PlaylistVersion[];
  selectedVersion: PlaylistVersion | null;
  onVersionSelect: (version: PlaylistVersion) => void;
  onRevert: (version: PlaylistVersion) => void;
}

export function VersionList({ 
  versions, 
  selectedVersion, 
  onVersionSelect, 
  onRevert 
}: VersionListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaHistory /> Version History
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {versions.map((version) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => onVersionSelect(version)}
              className={`
                bg-white/5 rounded-lg p-4 cursor-pointer
                ${selectedVersion?.id === version.id ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {version.metadata.aiGenerated ? (
                    <FaRobot className="text-purple-400" />
                  ) : (
                    <FaCodeBranch className="text-blue-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={version.author.avatar}
                        alt={version.author.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{version.author.username}</span>
                    </div>
                    <p className="text-sm opacity-70">
                      {version.changes.added.length} added, {version.changes.removed.length} removed
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRevert(version);
                  }}
                  className="px-3 py-1 bg-blue-500/20 rounded-full text-sm"
                >
                  Revert
                </button>
              </div>
              {version.metadata.aiGenerated && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaMagic className="text-purple-400" />
                    <span>AI Confidence: {version.metadata.confidence}%</span>
                  </div>
                  <p className="opacity-70">{version.metadata.reason}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
