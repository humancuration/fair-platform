export enum SurveyDomain {
  GENERAL = 'general',
  EVENT = 'event',
  GAME_TESTING = 'game_testing',
  ECO_PRODUCTION = 'eco_production',
  MEDIA_SCREENING = 'media_screening',
  PRODUCT_TESTING = 'product_testing',
  WORKER_FEEDBACK = 'worker_feedback'
}

export interface DomainSpecificFeatures {
  realTimeTracking?: boolean;
  geoLocation?: boolean;
  timeSeriesData?: boolean;
  mediaCapture?: boolean;
  environmentalMetrics?: boolean;
  interactiveElements?: boolean;
  automatedTesting?: boolean;
}

export interface SurveyTemplate {
  id: string;
  domain: SurveyDomain;
  name: string;
  description: string;
  features: DomainSpecificFeatures;
  questions: QuestionTemplate[];
  analytics: AnalyticsPreset[];
  integrations: IntegrationType[];
}
