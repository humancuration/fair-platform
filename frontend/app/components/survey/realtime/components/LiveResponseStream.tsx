import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStream, FaBrain, FaChartLine } from 'react-icons/fa';

interface LiveResponseStreamProps {
  data: any[];
  aiAnalysis: boolean;
}

export const LiveResponseStream: React.FC<LiveResponseStreamProps> = ({
  data,
  aiAnalysis
}) => {
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <motion.div 
      className="live-response-stream bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaStream className="mr-2" /> Live Responses
        </h3>
        {aiAnalysis && (
          <div className="flex items-center text-sm text-blue-600">
            <FaBrain className="mr-1" /> AI Analysis Active
          </div>
        )}
      </div>

      <div 
        ref={streamRef}
        className="h-64 overflow-y-auto space-y-2"
      >
        <AnimatePresence>
          {data?.map((response, index) => (
            <motion.div
              key={response.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="response-item p-3 bg-gray-50 rounded"
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {response.question}
                </span>
                <span className="text-xs text-gray-500">
                  {response.timestamp}
                </span>
              </div>
              <div className="mt-1 text-sm">
                {response.answer}
              </div>
              {aiAnalysis && response.aiInsights && (
                <div className="mt-2 text-xs text-blue-600 flex items-center">
                  <FaBrain className="mr-1" />
                  {response.aiInsights}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
