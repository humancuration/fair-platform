import { motion, AnimatePresence } from "framer-motion";
import { FaCodeBranch as FaCodeFork, FaCodeMerge as FaMerge } from "react-icons/fa6";
import type { PlaylistFork } from "~/types/version";

interface ForkListProps {
  forks: PlaylistFork[];
  onMerge: (forkId: string) => void;
}

export function ForkList({ forks, onMerge }: ForkListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaCodeFork /> Forks
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {forks.map((fork) => (
            <motion.div
              key={fork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{fork.name}</h4>
                  <p className="text-sm opacity-70">by {fork.forkedFrom.owner.username}</p>
                </div>
                <button
                  onClick={() => onMerge(fork.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full text-sm"
                >
                  <FaMerge /> Merge
                </button>
              </div>
              <div className="mt-2 text-sm">
                <p>+{fork.stats.tracksAdded} / -{fork.stats.tracksRemoved} tracks</p>
                <p>{fork.stats.totalChanges} total changes</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
