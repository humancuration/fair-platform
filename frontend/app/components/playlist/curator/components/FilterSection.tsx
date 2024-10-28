import { motion } from "framer-motion";
import { FaGem, FaRobot, FaUser, FaBrain, FaChartLine } from "react-icons/fa";
import type { CuratorFilter } from "~/types/curator";

interface FilterSectionProps {
  activeFilter: CuratorFilter;
  onFilterChange: (filter: CuratorFilter) => void;
}

export function FilterSection({ activeFilter, onFilterChange }: FilterSectionProps) {
  const filters = [
    { id: 'all', icon: FaGem, label: 'All Curators' },
    { id: 'ai', icon: FaRobot, label: 'AI Curators' },
    { id: 'human', icon: FaUser, label: 'Human Curators' },
    { id: 'hybrid', icon: FaBrain, label: 'Hybrid Curators' },
    { id: 'trending', icon: FaChartLine, label: 'Trending' }
  ] as const;

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {filters.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          onClick={() => onFilterChange(id as CuratorFilter)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${activeFilter === id ? 'bg-purple-500' : 'bg-white/10'}
          `}
        >
          <Icon />
          {label}
        </motion.button>
      ))}
    </div>
  );
}
