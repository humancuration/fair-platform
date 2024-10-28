import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaBrain, FaChartLine, FaUsers, FaLightbulb,
  FaClipboardCheck, FaRobot, FaGlobe 
} from "react-icons/fa";

interface SurveyTemplate {
  id: string;
  type: "research" | "community" | "feedback" | "assessment";
  title: string;
  description: string;
  aiFeatures: {
    questionGeneration: boolean;
    responseAnalysis: boolean;
    biasDetection: boolean;
    adaptiveBranching: boolean;
  };
  sections: SurveySection[];
  collaboration: {
    researchers: string[];
    aiAssistants: string[];
    reviewers: string[];
  };
  ethics: {
    guidelines: string[];
    biasControls: string[];
    transparencyLevel: number;
  };
}

const surveyModes = {
  research: {
    name: "Research Survey",
    description: "Scientific data collection and analysis",
    features: [
      {
        name: "Question Design",
        aiRole: "Suggests validated questions",
        humanRole: "Refines and contextualizes"
      },
      {
        name: "Response Analysis",
        aiRole: "Pattern detection and correlation",
        humanRole: "Interpretation and conclusions"
      },
      {
        name: "Bias Detection",
        aiRole: "Automated bias scanning",
        humanRole: "Mitigation strategies"
      }
    ]
  },
  community: {
    name: "Community Feedback",
    description: "Collective input and ideation",
    features: [
      {
        name: "Engagement Design",
        aiRole: "Optimizes for participation",
        humanRole: "Community context"
      },
      {
        name: "Sentiment Analysis",
        aiRole: "Emotional pattern detection",
        humanRole: "Cultural interpretation"
      }
    ]
  },
  assessment: {
    name: "Learning Assessment",
    description: "Knowledge and skill evaluation",
    features: [
      {
        name: "Adaptive Questions",
        aiRole: "Difficulty adjustment",
        humanRole: "Learning objectives"
      },
      {
        name: "Progress Tracking",
        aiRole: "Skill gap analysis",
        humanRole: "Development planning"
      }
    ]
  }
};

const analysisTools = {
  quantitative: {
    name: "Statistical Analysis",
    features: [
      "Distribution Analysis",
      "Correlation Detection",
      "Hypothesis Testing",
      "Trend Identification"
    ]
  },
  qualitative: {
    name: "Content Analysis",
    features: [
      "Theme Extraction",
      "Sentiment Analysis",
      "Pattern Recognition",
      "Narrative Analysis"
    ]
  },
  impact: {
    name: "Impact Assessment",
    features: [
      "Outcome Measurement",
      "Community Benefit",
      "Knowledge Generation",
      "Action Planning"
    ]
  }
};
