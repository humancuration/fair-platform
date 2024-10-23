import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeSurveyProps {
  surveyId: string;
  domain: SurveyDomain;
  features: DomainSpecificFeatures;
}

export const RealTimeSurvey: React.FC<RealTimeSurveyProps> = ({
  surveyId,
  domain,
  features
}) => {
  const [currentState, setCurrentState] = useState<any>(null);
  const ws = useWebSocket(`/survey/${surveyId}`);

  // Handle different types of real-time data
  useEffect(() => {
    if (!ws) return;

    switch (domain) {
      case SurveyDomain.GAME_TESTING:
        ws.on('game_state', handleGameState);
        ws.on('bug_report', handleBugReport);
        break;
      
      case SurveyDomain.MEDIA_SCREENING:
        ws.on('audience_reaction', handleAudienceReaction);
        ws.on('playback_sync', handlePlaybackSync);
        break;
      
      case SurveyDomain.ECO_PRODUCTION:
        ws.on('sensor_data', handleSensorData);
        ws.on('production_metrics', handleProductionMetrics);
        break;
    }
  }, [ws, domain]);

  const renderDomainSpecificUI = () => {
    switch (domain) {
      case SurveyDomain.GAME_TESTING:
        return <GameTestingInterface state={currentState} />;
      
      case SurveyDomain.MEDIA_SCREENING:
        return <MediaScreeningInterface state={currentState} />;
      
      case SurveyDomain.ECO_PRODUCTION:
        return <EcoProductionInterface state={currentState} />;
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="real-time-survey"
      >
        {renderDomainSpecificUI()}
        <RealTimeMetrics data={currentState} />
        <ResponseAggregator domain={domain} />
      </motion.div>
    </AnimatePresence>
  );
};
