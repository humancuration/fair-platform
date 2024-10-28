import { motion } from "framer-motion";
import { FaBrain, FaUsers, FaChartLine } from "react-icons/fa";

export function CollectiveInsights() {
  return (
    <motion.div 
      className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaBrain /> Collective Intelligence
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="text-purple-400" />
            <h3 className="font-semibold">Active Contributors</h3>
          </div>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-sm opacity-70">Contributing to shared playlists</p>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaChartLine className="text-green-400" />
            <h3 className="font-semibold">Collective Growth</h3>
          </div>
          <p className="text-2xl font-bold">+27%</p>
          <p className="text-sm opacity-70">Increase in collaborative curation</p>
        </div>

        {/* Add more insight cards */}
      </div>
    </motion.div>
  );
}
