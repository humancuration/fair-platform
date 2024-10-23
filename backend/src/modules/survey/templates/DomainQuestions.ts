export const domainSpecificQuestions = {
  // Media Screening Surveys
  [SurveyDomain.MEDIA_SCREENING]: {
    questions: [
      {
        type: 'timestamp_feedback',
        config: {
          syncWithMedia: true,
          markers: ['plot_point', 'technical_issue', 'emotional_response']
        }
      },
      {
        type: 'audience_reaction',
        config: {
          realtimeEmotions: true,
          aggregateView: true
        }
      },
      {
        type: 'technical_quality',
        aspects: ['visual', 'audio', 'subtitle_sync', 'color_grading']
      }
    ],
    analytics: ['audience_engagement_graph', 'emotional_heatmap', 'demographic_response']
  },

  // Game Testing
  [SurveyDomain.GAME_TESTING]: {
    questions: [
      {
        type: 'bug_report',
        config: {
          automaticGameState: true,
          screenshotCapture: true,
          replicationSteps: true,
          systemSpecs: true
        }
      },
      {
        type: 'gameplay_metrics',
        tracking: ['player_position', 'inventory', 'health', 'actions_taken']
      },
      {
        type: 'performance_monitoring',
        metrics: ['fps', 'latency', 'memory_usage', 'loading_times']
      }
    ],
    analytics: ['bug_clustering', 'performance_analysis', 'player_journey_mapping']
  },

  // Eco Production Surveys
  [SurveyDomain.ECO_PRODUCTION]: {
    questions: [
      {
        type: 'material_durability',
        config: {
          timeSeriesTracking: true,
          wearPatterns: true,
          environmentalConditions: true
        }
      },
      {
        type: 'production_efficiency',
        metrics: ['time_per_unit', 'material_waste', 'energy_consumption']
      },
      {
        type: 'worker_ergonomics',
        aspects: ['comfort', 'strain', 'repetitive_motion', 'workspace_adaptation']
      }
    ],
    analytics: ['sustainability_metrics', 'efficiency_optimization', 'worker_wellbeing']
  }
};
