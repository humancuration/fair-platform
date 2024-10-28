// typescript:frontend/app/components/survey/integrations/SurveyVisualizationHub.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
interface SurveyVisualizationConfig {
id: string;
surveyId: string;
visualizations: {
type: string;
config: Record<string, any>;
accessibility: {
features: string[];
compliance: string[];
};
governance: {
dataAccess: string[];
sharing: {
permissions: string[];
restrictions: string[];
};
};
}[];
aiFeatures: {
autoGeneration: boolean;
optimization: boolean;
insights: boolean;
};
}
const visualizationTypes = {
research: {
name: "Research Visualizations",
types: [
"Statistical Plots",
"Network Graphs",
"Geographic Maps",
"Time Series"
],
governance: {
access: ["Role-based", "Time-limited"],
sharing: ["Watermarking", "Version Control"]
}
},
accessibility: {
name: "Accessible Visualizations",
features: [
"Screen Reader Support",
"Keyboard Navigation",
"High Contrast Modes",
"Alternative Text"
],
compliance: ["WCAG 2.1", "Section 508"]
}
};