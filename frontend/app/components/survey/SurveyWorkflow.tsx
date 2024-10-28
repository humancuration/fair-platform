import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaBrain, FaChartLine, FaUsers, FaLightbulb,
  FaClipboardCheck, FaRobot, FaGlobe, FaFlask 
} from "react-icons/fa";

interface SurveyWorkflow {
  id: string;
  type: "research" | "feedback" | "assessment" | "longitudinal";
  stages: {
    design: {
      aiAssistance: boolean;
      templates: string[];
      validation: string[];
    };
    collection: {
      method: "automated" | "manual" | "hybrid";
      monitoring: boolean;
      quality: string[];
    };
    analysis: {
      aiTools: string[];
      visualization: string[];
      insights: string[];
    };
  };
  automation: {
    scheduling: boolean;
    reminders: boolean;
    dataProcessing: boolean;
    reporting: boolean;
  };
}

const workflowTypes = {
  research: {
    name: "Research Survey",
    description: "Scientific data collection",
    stages: [
      {
        name: "Design Phase",
        aiRole: "Question optimization",
        humanRole: "Research objectives"
      },
      {
        name: "Collection Phase",
        aiRole: "Quality monitoring",
        humanRole: "Participant engagement"
      },
      {
        name: "Analysis Phase",
        aiRole: "Pattern detection",
        humanRole: "Insight interpretation"
      }
    ]
  },
  longitudinal: {
    name: "Longitudinal Study",
    description: "Long-term data tracking",
    stages: [
      {
        name: "Timeline Planning",
        aiRole: "Interval optimization",
        humanRole: "Study design"
      },
      {
        name: "Retention Strategy",
        aiRole: "Engagement prediction",
        humanRole: "Participant support"
      }
    ]
  }
};
