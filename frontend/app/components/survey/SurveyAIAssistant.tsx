import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

interface SurveyAIAssistant {
  id: string;
  capabilities: {
    design: {
      questionSuggestions: boolean;
      biasChecking: boolean;
      flowOptimization: boolean;
    };
    analysis: {
      patternDetection: boolean;
      insightGeneration: boolean;
      visualizationSuggestions: boolean;
    };
    engagement: {
      participantSupport: boolean;
      responseQuality: boolean;
      adaptiveBranching: boolean;
    };
  };
  learning: {
    activeModels: string[];
    trainingData: string[];
    improvements: string[];
  };
}

const assistantModes = {
  designer: {
    name: "Survey Designer",
    description: "AI-powered survey creation",
    capabilities: [
      "Question optimization",
      "Flow analysis",
      "Bias detection",
      "Engagement prediction"
    ]
  },
  analyst: {
    name: "Survey Analyst",
    description: "Response analysis and insights",
    capabilities: [
      "Pattern recognition",
      "Trend analysis",
      "Insight generation",
      "Visualization suggestions"
    ]
  },
  moderator: {
    name: "Survey Moderator",
    description: "Participant engagement",
    capabilities: [
      "Response quality",
      "Participant support",
      "Adaptive branching",
      "Real-time monitoring"
    ]
  }
};
