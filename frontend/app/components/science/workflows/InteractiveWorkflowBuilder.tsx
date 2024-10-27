import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaCode, FaShare, FaSave, FaPlay, FaUsers,
  FaComments, FaHistory, FaLock, FaUnlock, FaGit
} from "react-icons/fa";

interface WorkflowNode {
  id: string;
  type: "source" | "process" | "analysis" | "visualization";
  name: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
  status: "idle" | "running" | "completed" | "error";
  assignee?: string;
  comments: {
    id: string;
    user: string;
    text: string;
    timestamp: string;
    resolved: boolean;
  }[];
  history: {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    changes: Record<string, any>;
  }[];
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "editor" | "viewer";
  status: "online" | "away" | "offline";
  cursor?: {
    x: number;
    y: number;
    timestamp: string;
  };
  focus?: {
    nodeId: string;
    timestamp: string;
  };
}

interface WorkflowVersion {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  author: string;
  changes: {
    nodes: {
      added: string[];
      modified: string[];
      removed: string[];
    };
    connections: {
      added: string[];
      removed: string[];
    };
  };
}

interface WorkflowPermissions {
  public: boolean;
  collaborative: boolean;
  roles: Record<string, "owner" | "editor" | "viewer">;
  inviteLinks: {
    id: string;
    role: "editor" | "viewer";
    expires: string;
    uses: number;
    maxUses?: number;
  }[];
}

const nodeTemplates = {
  source: {
    icon: "📥",
    name: "Data Source",
    description: "Connect to data sources",
    categories: [
      {
        name: "File Import",
        templates: ["CSV", "JSON", "Excel", "Database"]
      },
      {
        name: "Live Data",
        templates: ["API", "Streaming", "Sensors", "WebSocket"]
      },
      {
        name: "Generated",
        templates: ["Simulation", "Random", "Pattern", "Test Data"]
      }
    ]
  },
  process: {
    icon: "⚙️",
    name: "Data Processing",
    description: "Transform and clean data",
    categories: [
      {
        name: "Cleaning",
        templates: ["Filter", "Deduplicate", "Fill Missing", "Normalize"]
      },
      {
        name: "Transform",
        templates: ["Aggregate", "Pivot", "Join", "Split"]
      },
      {
        name: "Enrich",
        templates: ["Lookup", "Calculate", "Annotate", "Validate"]
      }
    ]
  },
  analysis: {
    icon: "🧮",
    name: "Analysis",
    description: "Analyze and model data",
    categories: [
      {
        name: "Statistics",
        templates: ["Summary", "Correlation", "Regression", "Testing"]
      },
      {
        name: "Machine Learning",
        templates: ["Classification", "Clustering", "Prediction", "Anomaly"]
      },
      {
        name: "Deep Learning",
        templates: ["Neural Net", "Transfer", "Fine-tune", "Evaluate"]
      }
    ]
  },
  visualization: {
    icon: "📊",
    name: "Visualization",
    description: "Create visualizations",
    categories: [
      {
        name: "Charts",
        templates: ["Line", "Bar", "Scatter", "Histogram"]
      },
      {
        name: "Maps",
        templates: ["Geographic", "Heat Map", "Network", "Tree"]
      },
      {
        name: "Interactive",
        templates: ["Dashboard", "Explorer", "Animation", "3D View"]
      }
    ]
  }
};

export function InteractiveWorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher();

  // Collaborative features
  const broadcastCursorPosition = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Broadcast cursor position to other users
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
    // Broadcast node position update
  };

  const handleNodeConnect = (fromId: string, toId: string) => {
    setNodes(prev => {
      const fromNode = prev.find(n => n.id === fromId);
      const toNode = prev.find(n => n.id === toId);
      if (!fromNode || !toNode) return prev;

      return prev.map(node => {
        if (node.id === fromId) {
          return { ...node, outputs: [...node.outputs, toId] };
        }
        if (node.id === toId) {
          return { ...node, inputs: [...node.inputs, fromId] };
        }
        return node;
      });
    });
    // Broadcast connection update
  };

  const handleComment = (nodeId: string, comment: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          comments: [
            ...node.comments,
            {
              id: Date.now().toString(),
              user: "current-user",
              text: comment,
              timestamp: new Date().toISOString(),
              resolved: false
            }
          ]
        };
      }
      return node;
    }));
    // Broadcast comment
  };

  return (
    <div className="workflow-builder h-screen flex">
      {/* Toolbox */}
      <div className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-bold mb-4">Components</h2>
        <div className="space-y-4">
          {Object.entries(nodeTemplates).map(([type, category]) => (
            <div key={type}>
              <h3 className="font-medium flex items-center gap-2">
                <span>{category.icon}</span>
                {category.name}
              </h3>
              <div className="mt-2 space-y-2">
                {category.categories.map(subcat => (
                  <div key={subcat.name}>
                    <h4 className="text-sm text-gray-600 mb-1">{subcat.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {subcat.templates.map(template => (
                        <motion.div
                          key={template}
                          className="p-2 bg-gray-50 rounded text-sm cursor-move"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          draggable
                        >
                          {template}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 bg-gray-50 relative overflow-hidden"
        onMouseMove={broadcastCursorPosition}
      >
        {/* Grid background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(25px,1fr))] grid-rows-[repeat(40,25px)] pointer-events-none">
          {Array.from({ length: 1600 }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-gray-200"
            />
          ))}
        </div>

        {/* Workflow nodes */}
        {nodes.map(node => (
          <motion.div
            key={node.id}
            className="absolute bg-white rounded-lg shadow-lg p-4"
            style={{ left: node.position.x, top: node.position.y }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => handleNodeDrag(node.id, {
              x: node.position.x + info.offset.x,
              y: node.position.y + info.offset.y
            })}
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{nodeTemplates[node.type].icon}</span>
              <span className="font-medium">{node.name}</span>
              {node.assignee && (
                <img
                  src={collaborators.find(c => c.id === node.assignee)?.avatar}
                  className="w-6 h-6 rounded-full"
                  alt="Assignee"
                />
              )}
            </div>
            
            {/* Node controls */}
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSelectedNode(node)}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded"
              >
                Configure
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="px-2 py-1 bg-purple-100 text-purple-600 rounded"
              >
                Comments
              </button>
            </div>
          </motion.div>
        ))}

        {/* Collaborator cursors */}
        {collaborators
          .filter(c => c.status === "online" && c.cursor)
          .map(collaborator => (
            <motion.div
              key={collaborator.id}
              className="absolute pointer-events-none"
              animate={{
                x: collaborator.cursor!.x,
                y: collaborator.cursor!.y
              }}
            >
              <div className="relative">
                <div
                  className="w-4 h-4 transform rotate-45"
                  style={{ backgroundColor: getCollaboratorColor(collaborator.id) }}
                />
                <div className="absolute top-5 left-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {collaborator.name}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Right sidebar */}
      <div className="w-64 bg-white border-l">
        {/* Collaborators */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-2">Collaborators</h3>
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <img
                    src={collaborator.avatar}
                    className="w-8 h-8 rounded-full"
                    alt={collaborator.name}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      collaborator.status === "online" ? "bg-green-500" :
                      collaborator.status === "away" ? "bg-yellow-500" :
                      "bg-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {collaborator.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {collaborator.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version history */}
        <div className="p-4">
          <h3 className="font-medium mb-2">History</h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowVersions(true)}
              className="w-full px-3 py-2 bg-gray-100 rounded text-sm text-left"
            >
              View versions...
            </button>
          </div>
        </div>
      </div>

      {/* Node configuration modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Configure Node</h3>
              {/* Node configuration UI */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save configuration
                    setSelectedNode(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to generate consistent colors for collaborators
function getCollaboratorColor(id: string): string {
  const colors = [
    "#4CAF50", "#2196F3", "#9C27B0", "#FF9800",
    "#E91E63", "#00BCD4", "#FF5722", "#795548"
  ];
  return colors[parseInt(id, 16) % colors.length];
}
