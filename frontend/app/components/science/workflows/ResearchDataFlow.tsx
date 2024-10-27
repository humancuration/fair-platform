import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaDatabase, FaChartBar, FaCode, FaBrain,
  FaShare, FaSave, FaPlay, FaDownload, FaGlobe,
  FaNetworkWired, FaProjectDiagram, FaLightbulb 
} from "react-icons/fa";

interface DataFlow {
  id: string;
  name: string;
  description: string;
  stage: "collection" | "processing" | "analysis" | "visualization";
  type: "timeseries" | "spatial" | "network" | "multimodal";
  sources: {
    id: string;
    type: string;
    format: string;
    frequency: string;
    quality: number;
  }[];
  pipeline: {
    steps: {
      id: string;
      name: string;
      type: string;
      config: Record<string, any>;
      dependencies: string[];
      computeNeeds: {
        gpu?: boolean;
        memory: string;
        storage: string;
      };
    }[];
    validation: {
      tests: string[];
      metrics: string[];
      thresholds: Record<string, number>;
    };
  };
  visualizations: {
    id: string;
    type: string;
    config: Record<string, any>;
    interactivity: string[];
    accessibility: string[];
  }[];
  collaboration: {
    team: string[];
    roles: Record<string, string>;
    access: Record<string, string[]>;
    comments: {
      id: string;
      user: string;
      text: string;
      timestamp: string;
    }[];
  };
  resources: {
    compute: {
      allocated: number;
      used: number;
      remaining: number;
    };
    storage: {
      allocated: string;
      used: string;
      remaining: string;
    };
    credits: {
      allocated: number;
      used: number;
      remaining: number;
    };
  };
}

interface DataSource {
  id: string;
  name: string;
  type: "sensor" | "api" | "upload" | "stream" | "simulation";
  format: string;
  schema: {
    fields: {
      name: string;
      type: string;
      description?: string;
      constraints?: string[];
    }[];
    relationships?: {
      from: string;
      to: string;
      type: string;
    }[];
  };
  quality: {
    completeness: number;
    accuracy: number;
    timeliness: number;
  };
  access: {
    method: string;
    credentials?: {
      type: string;
      details: Record<string, string>;
    };
    rate_limits?: {
      requests: number;
      period: string;
    };
  };
}

interface ProcessingStep {
  id: string;
  name: string;
  type: "clean" | "transform" | "merge" | "reduce" | "analyze";
  inputs: string[];
  outputs: string[];
  config: {
    operations: {
      type: string;
      params: Record<string, any>;
    }[];
    validation: {
      rules: string[];
      actions: string[];
    };
  };
  resources: {
    compute: string;
    memory: string;
    storage: string;
  };
}

interface VisualizationType {
  id: string;
  name: string;
  category: "exploration" | "analysis" | "presentation";
  description: string;
  suitableFor: string[];
  features: string[];
  examples: {
    thumbnail: string;
    description: string;
  }[];
}

const dataCategories = {
  collection: {
    icon: <FaDatabase className="text-2xl" />,
    title: "Data Collection",
    description: "Gather and validate research data",
    tools: [
      {
        name: "Sensor Integration",
        features: ["Real-time", "Quality Checks", "Automated"],
        formats: ["CSV", "JSON", "Binary"]
      },
      {
        name: "API Connectors",
        features: ["Rate Limiting", "Auth", "Caching"],
        formats: ["REST", "GraphQL", "SOAP"]
      },
      {
        name: "Batch Upload",
        features: ["Validation", "Deduplication", "Versioning"],
        formats: ["Excel", "SQL", "NoSQL"]
      }
    ]
  },
  processing: {
    icon: <FaCode className="text-2xl" />,
    title: "Data Processing",
    description: "Clean and transform data",
    tools: [
      {
        name: "Data Cleaning",
        features: ["Missing Values", "Outliers", "Normalization"],
        methods: ["Statistical", "ML-based", "Rule-based"]
      },
      {
        name: "Feature Engineering",
        features: ["Extraction", "Selection", "Creation"],
        methods: ["Domain-driven", "Automated", "Hybrid"]
      },
      {
        name: "Data Integration",
        features: ["Merging", "Linking", "Enrichment"],
        methods: ["Schema Mapping", "Entity Resolution", "Fusion"]
      }
    ]
  },
  analysis: {
    icon: <FaBrain className="text-2xl" />,
    title: "Data Analysis",
    description: "Extract insights and patterns",
    tools: [
      {
        name: "Statistical Analysis",
        features: ["Hypothesis Testing", "Regression", "Clustering"],
        methods: ["Parametric", "Non-parametric", "Bayesian"]
      },
      {
        name: "Machine Learning",
        features: ["Classification", "Prediction", "Anomaly Detection"],
        methods: ["Supervised", "Unsupervised", "Reinforcement"]
      },
      {
        name: "Network Analysis",
        features: ["Community Detection", "Centrality", "Path Analysis"],
        methods: ["Graph Theory", "Social Network", "Complex Systems"]
      }
    ]
  },
  visualization: {
    icon: <FaChartBar className="text-2xl" />,
    title: "Data Visualization",
    description: "Create interactive visualizations",
    tools: [
      {
        name: "Static Plots",
        features: ["Publication Ready", "Custom Themes", "Export"],
        types: ["Statistical", "Scientific", "Presentation"]
      },
      {
        name: "Interactive Dashboards",
        features: ["Real-time", "Filtering", "Drill-down"],
        types: ["Web-based", "Desktop", "Mobile"]
      },
      {
        name: "3D Visualization",
        features: ["WebGL", "VR Support", "Animation"],
        types: ["Scientific", "Medical", "Engineering"]
      }
    ]
  }
};

// Continue with component implementation...
