import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { MinsiteVersion } from "~/types/models";

interface VersionHistoryProps {
  versions: MinsiteVersion[];
  onRevert: (version: MinsiteVersion) => void;
}

export function VersionHistory({ versions, onRevert }: VersionHistoryProps) {
  return (
    <div className="version-history mt-8">
      <h3 className="text-lg font-semibold mb-4">Version History</h3>
      <AnimatePresence>
        <div className="space-y-2">
          {versions.map((version) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              <div>
                <p className="font-medium">{version.title}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(version.createdAt), "PPpp")}
                </p>
                {version.template && (
                  <p className="text-xs text-gray-400">
                    Template: {version.template}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRevert(version)}
                  className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded"
                >
                  Revert
                </button>
                <button
                  onClick={() => window.open(`/minsite/preview/${version.id}`, '_blank')}
                  className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded"
                >
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
