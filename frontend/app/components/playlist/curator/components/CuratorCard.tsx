import { motion } from "framer-motion";
import { FaRobot, FaUser, FaBrain, FaStar, FaGem } from "react-icons/fa";
import type { Curator } from "~/types/curator";

interface CuratorCardProps {
  curator: Curator;
  onFollow: () => void;
}

export function CuratorCard({ curator, onFollow }: CuratorCardProps) {
  const TypeIcon = {
    ai: FaRobot,
    human: FaUser,
    hybrid: FaBrain
  }[curator.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
      className={`
        bg-gradient-to-br rounded-xl p-6
        ${curator.type === 'ai' ? 'from-purple-900/30 to-blue-900/30' : 
          curator.type === 'hybrid' ? 'from-green-900/30 to-blue-900/30' :
          'from-orange-900/30 to-red-900/30'}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={curator.avatar}
            alt={curator.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-bold">{curator.name}</h3>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <TypeIcon />
              <span>{curator.type.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span>{curator.curatorScore.toFixed(1)}</span>
          </div>
          <div className="text-sm opacity-80">Curator Score</div>
        </div>
      </div>

      <p className="mt-4 text-sm opacity-90">{curator.bio}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {curator.badges.map(badge => (
          <motion.span
            key={badge.type}
            whileHover={{ scale: 1.1 }}
            className="px-2 py-1 bg-white/10 rounded-full text-xs flex items-center gap-1"
            title={badge.description}
          >
            <FaGem /> {badge.label}
          </motion.span>
        ))}
      </div>

      <button
        onClick={onFollow}
        className="mt-4 w-full py-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors"
      >
        Follow Curator
      </button>
    </motion.div>
  );
}
