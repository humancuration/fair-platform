import { motion } from "framer-motion";
import { FaChartLine, FaUsers } from "react-icons/fa";
import type { Curator } from "~/types/curator";

interface CuratorTrendingCardProps {
  curator: Curator;
}

export function CuratorTrendingCard({ curator }: CuratorTrendingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4"
    >
      <div className="flex items-center gap-4">
        <img
          src={curator.avatar}
          alt={curator.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="font-bold">{curator.name}</h3>
          <p className="text-sm opacity-80">
            {curator.stats.monthlyListeners.toLocaleString()} monthly listeners
          </p>
        </div>
      </div>
    </motion.div>
  );
}
