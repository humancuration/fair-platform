import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

interface SurveyResponse {
  id: string;
  surveyId: string;
  respondent: {
    id: string;
    type: "human" | "ai" | "hybrid";
    demographics?: Record<string, any>;
    consent: boolean;
  };
  answers: {
    questionId: string;
    value: any;
    metadata: {
      timeSpent: number;
      confidence: number;
      aiAssisted: boolean;
    };
  }[];
  quality: {
    completeness: number;
    consistency: number;
    uniqueValue: number;
  };
  aiAnalysis: {
    sentimentScore: number;
    keyInsights: string[];
    suggestedFollowup: string[];
    reliability: number;
  };
}

interface ResponseAnalytics {
  aggregated: {
    totalResponses: number;
    averageCompletion: number;
    demographicBreakdown: Record<string, number>;
    keyFindings: string[];
  };
  aiInsights: {
    patterns: string[];
    anomalies: string[];
    recommendations: string[];
    confidenceLevel: number;
  };
  impact: {
    researchValue: number;
    communityBenefit: number;
    knowledgeContribution: number;
  };
}
