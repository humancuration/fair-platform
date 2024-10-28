import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaBrain, FaUsers } from 'react-icons/fa';

interface ResearchInterfaceProps {
  state: any;
  features: {
    aiAssistance: {
      realTimeAnalysis: boolean;
      sentimentTracking: boolean;
      anomalyDetection: boolean;
    };
    visualization: {
      liveCharts: boolean;
      interactiveElements: boolean;
    };
  };
}

export const ResearchInterface: React.FC<ResearchInterfaceProps> = ({
  state,
  features
}) => {
  return (
    <motion.div className="research-interface">
      <div className="grid grid-cols-2 gap-4">
        <LiveResponseStream 
          data={state?.responses}
          aiAnalysis={features.aiAssistance.realTimeAnalysis}
        />
        
        <RealTimeInsights
          insights={state?.insights}
          anomalies={state?.anomalies}
          showSentiment={features.aiAssistance.sentimentTracking}
        />
        
        <StatisticalOverview
          stats={state?.statistics}
          interactive={features.visualization.interactiveElements}
        />
        
        <ParticipantEngagement
          metrics={state?.engagement}
          trends={state?.trends}
        />
      </div>
    </motion.div>
  );
};
