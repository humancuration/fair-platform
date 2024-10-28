import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

interface StatisticalOverviewProps {
  stats: {
    distributions: any[];
    correlations: any[];
    trends: any[];
    summary: {
      mean: number;
      median: number;
      mode: number;
      variance: number;
    };
  };
  interactive: boolean;
}

export const StatisticalOverview: React.FC<StatisticalOverviewProps> = ({
  stats,
  interactive
}) => {
  return (
    <motion.div 
      className="statistical-overview bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaChartLine className="mr-2" /> Statistical Overview
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Distribution Charts */}
        <motion.div 
          className="p-3 bg-gray-50 rounded"
          whileHover={interactive ? { scale: 1.02 } : {}}
        >
          <h4 className="text-sm font-medium flex items-center mb-2">
            <FaChartBar className="mr-1" /> Response Distribution
          </h4>
          <div className="h-32">
            {/* Add your preferred charting library component here */}
          </div>
        </motion.div>

        {/* Correlation Analysis */}
        <motion.div 
          className="p-3 bg-gray-50 rounded"
          whileHover={interactive ? { scale: 1.02 } : {}}
        >
          <h4 className="text-sm font-medium flex items-center mb-2">
            <FaChartPie className="mr-1" /> Correlations
          </h4>
          <div className="h-32">
            {/* Add your preferred charting library component here */}
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <div className="col-span-2 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-medium mb-2">Summary Statistics</h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Mean:</span>
              <br />
              {stats?.summary?.mean.toFixed(2)}
            </div>
            <div>
              <span className="text-gray-500">Median:</span>
              <br />
              {stats?.summary?.median.toFixed(2)}
            </div>
            <div>
              <span className="text-gray-500">Mode:</span>
              <br />
              {stats?.summary?.mode.toFixed(2)}
            </div>
            <div>
              <span className="text-gray-500">Variance:</span>
              <br />
              {stats?.summary?.variance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
