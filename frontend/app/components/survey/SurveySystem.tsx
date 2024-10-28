import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaChartLine, FaBrain, FaUsers, FaLightbulb,
  FaClipboardCheck, FaComments, FaGlobe 
} from "react-icons/fa";

interface Survey {
  id: string;
  title: string;
  description: string;
  type: "research" | "feedback" | "community" | "impact";
  status: "draft" | "active" | "completed" | "analyzed";
  methodology: {
    approach: "quantitative" | "qualitative" | "mixed";
    aiAssistance: boolean;
    validationMethod: string[];
    biasControls: string[];
  };
  questions: SurveyQuestion[];
  analytics: {
    responses: number;
    completion: number;
    averageTime: number;
    insights: string[];
  };
  aiFeatures: {
    responseAnalysis: boolean;
    biasDetection: boolean;
    insightGeneration: boolean;
    trendPrediction: boolean;
  };
  collaboration: {
    researchers: string[];
    reviewers: string[];
    aiAssistants: string[];
    roles: Record<string, string>;
  };
}

interface SurveyQuestion {
  id: string;
  type: "multiple" | "scale" | "open" | "matrix" | "ranking";
  prompt: string;
  options?: string[];
  validation?: {
    required: boolean;
    rules: string[];
    aiValidation?: boolean;
  };
  analysis: {
    method: string[];
    aiAssisted: boolean;
    metrics: string[];
  };
  metadata: {
    category: string;
    tags: string[];
    researchValue: number;
  };
}

const surveyAnalytics = {
  quantitative: {
    icon: <FaChartLine className="text-2xl" />,
    title: "Statistical Analysis",
    features: [
      "Descriptive Statistics",
      "Inferential Analysis",
      "Correlation Studies",
      "Trend Detection"
    ]
  },
  qualitative: {
    icon: <FaBrain className="text-2xl" />,
    title: "AI-Powered Analysis",
    features: [
      "Sentiment Analysis",
      "Theme Extraction",
      "Pattern Recognition",
      "Insight Generation"
    ]
  },
  impact: {
    icon: <FaGlobe className="text-2xl" />,
    title: "Impact Assessment",
    features: [
      "Community Benefit",
      "Research Value",
      "Knowledge Generation",
      "Action Recommendations"
    ]
  }
};
