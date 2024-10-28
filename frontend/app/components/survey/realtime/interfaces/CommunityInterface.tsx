import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaLightbulb } from 'react-icons/fa';

interface CommunityInterfaceProps {
  state: any;
  features: {
    aiAssistance: {
      sentimentTracking: boolean;
      topicModeling: boolean;
      participantSupport: boolean;
    };
    visualization: {
      interactiveElements: boolean;
      realTimeNetworks: boolean;
    };
  };
}

export const CommunityInterface: React.FC<CommunityInterfaceProps> = ({
  state,
  features
}) => {
  return (
    <motion.div className="community-interface">
      <div className="grid grid-cols-2 gap-4">
        <CommunityPulse
          sentiment={state?.sentiment}
          topics={state?.activeTopics}
          aiEnabled={features.aiAssistance.sentimentTracking}
        />
        
        <EngagementMetrics
          participation={state?.participation}
          interaction={state?.interaction}
          support={features.aiAssistance.participantSupport}
        />
        
        <TopicEvolution
          topics={state?.topics}
          trends={state?.topicTrends}
          modeling={features.aiAssistance.topicModeling}
        />
        
        <CommunityNetwork
          connections={state?.connections}
          interactive={features.visualization.realTimeNetworks}
        />
      </div>
    </motion.div>
  );
};
