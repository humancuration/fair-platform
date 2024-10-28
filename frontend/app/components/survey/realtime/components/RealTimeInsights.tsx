import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaBrain, FaExclamationTriangle } from 'react-icons/fa';

interface RealTimeInsightsProps {
  insights: string[];
  anomalies: any[];
  showSentiment: boolean;
}

export const RealTimeInsights: React.FC<RealTimeInsightsProps> = ({
  insights,
  anomalies,
  showSentiment
}) => {
  return (
    <motion.div 
      className="real-time-insights bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaLightbulb className="mr-2" /> Real-Time Insights
        </h3>
      </div>

      <div className="space-y-4">
        {/* AI Generated Insights */}
        <div className="insights-section">
          <h4 className="text-sm font-medium flex items-center mb-2">
            <FaBrain className="mr-1" /> AI Analysis
          </h4>
          <div className="space-y-2">
            {insights?.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 bg-blue-50 rounded text-sm"
              >
                {insight}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Anomalies */}
        {anomalies?.length > 0 && (
          <div className="anomalies-section">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <FaExclamationTriangle className="mr-1 text-yellow-500" /> 
              Detected Anomalies
            </h4>
            <div className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-yellow-50 rounded text-sm"
                >
                  {anomaly.description}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sentiment Analysis */}
        {showSentiment && (
          <SentimentTracker 
            data={insights?.filter(i => i.type === 'sentiment')}
          />
        )}
      </div>
    </motion.div>
  );
};
