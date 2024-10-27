// AI Research Types
export interface AIResearchTool {
  id: string;
  name: string;
  type: "model" | "dataset" | "framework" | "analysis" | "collaboration";
  capabilities: string[];
  requirements: {
    compute: string;
    memory: string;
    storage: string;
  };
  integrations: string[];
  ethics: {
    guidelines: string[];
    safeguards: string[];
    transparency: number;
  };
}

// Collaboration Types
export interface CollaborationSession {
  id: string;
  type: "research" | "analysis" | "writing" | "review";
  participants: {
    humans: Collaborator[];
    ais: AIAssistant[];
  };
  workspace: WorkspaceData;
  history: SessionHistory;
}

// Add other shared types...
