import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaChartLine, FaBrain, FaUsers } from "react-icons/fa";

interface AnalyticsConfig {
  id: string;
  surveyId: string;
  methods: {
    statistical: boolean;
    aiAssisted: boolean;
    qualitative: boolean;
  };
  visualizations: {
    type: string[];
    interactive: boolean;
    realTime: boolean;
  };
  aiFeatures: {
    patternDetection: boolean;
    outlierAnalysis: boolean;
    insightGeneration: boolean;
    trendPrediction: boolean;
  };
  collaboration: {
    researchers: string[];
    aiAgents: string[];
    roles: Record<string, string>;
  };
}

const analyticsFeatures = {
  basic: {
    name: "Basic Analytics",
    description: "Essential survey analysis tools",
    features: [
      "Response Distribution",
      "Cross Tabulation",
      "Basic Visualization",
      "Summary Statistics"
    ]
  },
  advanced: {
    name: "Advanced Analytics",
    description: "Complex statistical analysis",
    features: [
      "Factor Analysis",
      "Regression Modeling",
      "Cluster Analysis",
      "Time Series Analysis"
    ]
  },
  ai: {
    name: "AI-Powered Analytics",
    description: "Machine learning enhanced analysis",
    features: [
      "Pattern Recognition",
      "Predictive Modeling",
      "Natural Language Processing",
      "Automated Insight Generation"
    ]
  }
};
