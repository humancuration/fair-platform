import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

interface SurveyVisualization {
  id: string;
  type: "realtime" | "aggregate" | "comparative";
  features: {
    interactive: boolean;
    aiGenerated: boolean;
    customizable: boolean;
  };
  displays: {
    type: string[];
    layout: string;
    theme: string;
  };
  insights: {
    automatic: boolean;
    aiSuggested: boolean;
    collaborative: boolean;
  };
}

const visualizationModes = {
  standard: {
    name: "Standard Charts",
    types: ["Bar", "Line", "Pie", "Scatter"],
    features: ["Interactive", "Exportable", "Customizable"]
  },
  advanced: {
    name: "Advanced Analytics",
    types: ["Network", "Heatmap", "3D Plot", "Timeline"],
    features: ["AI-generated", "Dynamic", "Drill-down"]
  },
  custom: {
    name: "Custom Visualizations",
    types: ["Composite", "Animated", "Geographic"],
    features: ["Template-based", "Brand-aligned", "Shareable"]
  }
};

const insightTypes = {
  automatic: {
    name: "Automated Insights",
    features: [
      "Pattern Detection",
      "Anomaly Highlighting",
      "Trend Analysis",
      "Correlation Discovery"
    ]
  },
  collaborative: {
    name: "Collaborative Analysis",
    features: [
      "Team Annotations",
      "Shared Findings",
      "Discussion Thread",
      "Version Control"
    ]
  }
};
