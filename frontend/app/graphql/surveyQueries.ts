import { gql } from '@apollo/client';

export const SURVEY_TEMPLATES = gql`
  query GetSurveyTemplates($category: String) {
    surveyTemplates(category: $category) {
      id
      name
      description
      category
      complexity
      questions {
        id
        type
        text
        options
        validations
        analyticsPreset
      }
      analyticsPresets {
        id
        name
        description
        visualizations
        statisticalMethods
        exportFormats
      }
    }
  }
`;

export const COMBINED_ANALYSIS_QUERY = gql`
  query CombinedAnalysis($surveyIds: [ID!]!, $preset: String) {
    combinedAnalysis(surveyIds: $surveyIds, preset: $preset) {
      questionId
      questionType
      responses {
        answer
        count
        percentage
      }
      aggregates {
        mean
        median
        mode
        standardDeviation
        correlations {
          questionId
          coefficient
          strength
        }
      }
      advancedMetrics {
        rSquared
        pValue
        confidenceInterval
        variance
        skewness
        kurtosis
      }
    }
  }
`;

export const CORRELATIONS_QUERY = gql`
  query CrossSurveyCorrelations(
    $surveyIds: [ID!]!
    $questionIds: [String!]!
    $method: String
  ) {
    crossSurveyCorrelations(
      surveyIds: $surveyIds
      questionIds: $questionIds
      method: $method
    ) {
      questionPair
      coefficient
      strength
      pValue
      confidenceInterval
    }
  }
`;
