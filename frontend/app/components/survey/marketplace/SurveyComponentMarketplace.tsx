import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaStore, FaPuzzlePiece, FaChartLine, FaBrain,
  FaRobot, FaGlobe, FaUsers, FaLightbulb 
} from "react-icons/fa";

interface MarketplaceComponent {
  id: string;
  type: "question" | "analysis" | "visualization" | "ai" | "template";
  name: string;
  description: string;
  creator: {
    id: string;
    type: "human" | "ai" | "hybrid";
    reputation: number;
  };
  stats: {
    downloads: number;
    rating: number;
    reviews: number;
  };
  pricing: {
    model: "free" | "premium" | "subscription";
    price?: number;
    features: string[];
  };
  compatibility: {
    platforms: string[];
    integrations: string[];
    requirements: string[];
  };
}

const componentCategories = {
  questions: {
    icon: <FaPuzzlePiece className="text-2xl" />,
    name: "Question Templates",
    description: "Pre-built question components",
    types: [
      {
        name: "Research Questions",
        features: ["Validated Scales", "Academic Standards", "Citation Support"],
        aiCapabilities: ["Adaptation", "Translation", "Validation"]
      },
      {
        name: "Community Feedback",
        features: ["Engagement Optimized", "Cultural Awareness", "Inclusive Design"],
        aiCapabilities: ["Sentiment Analysis", "Language Adaptation", "Response Prediction"]
      }
    ]
  },
  analysis: {
    icon: <FaChartLine className="text-2xl" />,
    name: "Analysis Tools",
    description: "Advanced analytics components",
    types: [
      {
        name: "Statistical Analysis",
        features: ["Automated Testing", "Result Interpretation", "Visualization"],
        aiCapabilities: ["Method Selection", "Outlier Detection", "Insight Generation"]
      },
      {
        name: "AI Analysis",
        features: ["Pattern Recognition", "Predictive Models", "Natural Language"],
        aiCapabilities: ["Deep Learning", "Transfer Learning", "AutoML"]
      }
    ]
  },
  templates: {
    icon: <FaGlobe className="text-2xl" />,
    name: "Survey Templates",
    description: "Complete survey solutions",
    types: [
      {
        name: "Research Studies",
        features: ["IRB Compliant", "Data Management", "Analysis Pipeline"],
        aiCapabilities: ["Protocol Optimization", "Bias Detection", "Quality Control"]
      },
      {
        name: "Impact Assessment",
        features: ["SDG Alignment", "Stakeholder Mapping", "Action Tracking"],
        aiCapabilities: ["Impact Prediction", "Recommendation Engine", "Progress Tracking"]
      }
    ]
  }
};

const marketplaceFeatures = {
  discovery: {
    name: "Smart Discovery",
    features: [
      "AI-powered recommendations",
      "Similar component finder",
      "Integration suggestions",
      "Usage analytics"
    ]
  },
  collaboration: {
    name: "Creator Collaboration",
    features: [
      "Component remixing",
      "Version control",
      "Attribution tracking",
      "Revenue sharing"
    ]
  },
  quality: {
    name: "Quality Assurance",
    features: [
      "Automated testing",
      "Peer review system",
      "Usage analytics",
      "Impact metrics"
    ]
  }
};
