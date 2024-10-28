import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaBrain, FaChartLine, FaUsers, FaLightbulb,
  FaClipboardCheck, FaRobot, FaGlobe 
} from "react-icons/fa";

interface QuestionTemplate {
  id: string;
  type: "multiple" | "scale" | "open" | "matrix" | "ranking" | "adaptive";
  prompt: string;
  aiAssistance: {
    suggestionEngine: boolean;
    biasDetection: boolean;
    clarityCheck: boolean;
    adaptiveBranching: boolean;
  };
  validation: {
    rules: string[];
    aiValidation: boolean;
    humanReview: boolean;
  };
  analytics: {
    responseTracking: boolean;
    sentimentAnalysis: boolean;
    patternDetection: boolean;
  };
}

const questionTypes = {
  research: {
    name: "Research Questions",
    description: "Scientific inquiry and data collection",
    templates: [
      {
        name: "Hypothesis Testing",
        aiRole: "Validates statistical approach",
        humanRole: "Defines research context"
      },
      {
        name: "Exploratory Analysis",
        aiRole: "Suggests correlations",
        humanRole: "Interprets findings"
      }
    ]
  },
  assessment: {
    name: "Knowledge Assessment",
    description: "Learning and skill evaluation",
    templates: [
      {
        name: "Adaptive Testing",
        aiRole: "Adjusts difficulty",
        humanRole: "Sets learning goals"
      },
      {
        name: "Skill Verification",
        aiRole: "Tracks progress",
        humanRole: "Provides feedback"
      }
    ]
  }
};

const aiAssistanceFeatures = {
  suggestion: {
    name: "AI Suggestions",
    features: [
      "Question refinement",
      "Response options",
      "Validation rules",
      "Branching logic"
    ]
  },
  analysis: {
    name: "Response Analysis",
    features: [
      "Pattern detection",
      "Bias identification",
      "Quality scoring",
      "Insight generation"
    ]
  }
};
