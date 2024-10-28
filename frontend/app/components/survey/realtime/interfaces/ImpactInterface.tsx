import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaChartLine, FaLightbulb } from 'react-icons/fa';

interface ImpactInterfaceProps {
  state: any;
  features: {
    aiAssistance: {
      impactPrediction: boolean;
      stakeholderAnalysis: boolean;
      outcomeTracking: boolean;
    };
    visualization: {
      interactiveElements: boolean;
      geographicMapping: boolean;
    };
  };
}

export const ImpactInterface: React.FC<ImpactInterfaceProps> = ({
  state,
  features
}) => {
  return (
    <motion.div className="impact-interface">
      <div className="grid grid-cols-2 gap-4">
        <ImpactMetrics
          outcomes={state?.outcomes}
          predictions={state?.predictions}
          aiEnabled={features.aiAssistance.impactPrediction}
        />
        
        <StakeholderInsights
          stakeholders={state?.stakeholders}
          analysis={state?.stakeholderAnalysis}
          aiEnabled={features.aiAssistance.stakeholderAnalysis}
        />
        
        <OutcomeTracking
          progress={state?.progress}
          milestones={state?.milestones}
          tracking={features.aiAssistance.outcomeTracking}
        />
        
        <GeographicImpact
          data={state?.geographicData}
          interactive={features.visualization.geographicMapping}
        />
      </div>
    </motion.div>
  );
};
