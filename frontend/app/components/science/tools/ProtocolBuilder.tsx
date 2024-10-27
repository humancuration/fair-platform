import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaPlus, FaTrash, FaSave, FaShare, FaCopy, FaDownload } from "react-icons/fa";

interface ProtocolStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
  materials?: string[];
  equipment?: string[];
  safety?: string[];
  notes?: string;
  validation?: {
    checkpoints: string[];
    expectedResults: string;
  };
  media?: {
    type: "image" | "video" | "diagram";
    url: string;
    caption: string;
  }[];
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  steps: ProtocolStep[];
  metadata: {
    authors: string[];
    institution?: string;
    dateCreated: string;
    lastModified: string;
    citations?: string[];
    license: string;
  };
  requirements: {
    materials: string[];
    equipment: string[];
    safety: string[];
    skills: string[];
  };
}

const protocolTemplates = {
  lab: {
    icon: "🧪",
    title: "Laboratory Experiment",
    sections: ["Setup", "Procedure", "Analysis", "Cleanup"]
  },
  field: {
    icon: "🌿",
    title: "Field Study",
    sections: ["Site Selection", "Data Collection", "Sample Processing", "Documentation"]
  },
  computational: {
    icon: "💻",
    title: "Computational Study",
    sections: ["Data Preparation", "Analysis", "Validation", "Visualization"]
  }
};

export function ProtocolBuilder() {
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [selectedStep, setSelectedStep] = useState<ProtocolStep | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fetcher = useFetcher();

  const handleAddStep = () => {
    const newStep: ProtocolStep = {
      id: `step-${Date.now()}`,
      title: "New Step",
      description: "",
      materials: [],
      equipment: [],
      safety: []
    };

    setActiveProtocol(prev => prev ? {
      ...prev,
      steps: [...prev.steps, newStep]
    } : null);
  };

  const handleStepUpdate = (stepId: string, updates: Partial<ProtocolStep>) => {
    setActiveProtocol(prev => prev ? {
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    } : null);
  };

  return (
    <div className="protocol-builder p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Protocol Builder 📋
          </h2>
          <p className="text-gray-600 mt-1">Create detailed research protocols</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
          >
            {previewMode ? "Edit Protocol" : "Preview Protocol"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaSave /> Save Protocol
          </motion.button>
        </div>
      </div>

      {/* Protocol Templates */}
      {!activeProtocol && (
        <div className="mb-8">
          <h3 className="font-bold mb-4">Start with a Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(protocolTemplates).map(([key, template]) => (
              <motion.div
                key={key}
                className="p-6 border rounded-lg cursor-pointer hover:border-blue-500"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">{template.icon}</div>
                <h4 className="font-medium mb-2">{template.title}</h4>
                <div className="space-y-1">
                  {template.sections.map(section => (
                    <div key={section} className="text-sm text-gray-600">
                      • {section}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Protocol Editor */}
      {activeProtocol && !previewMode && (
        <div className="grid grid-cols-3 gap-6">
          {/* Steps Sidebar */}
          <div className="col-span-1 border-r pr-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Protocol Steps</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddStep}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <FaPlus />
              </motion.button>
            </div>

            <div className="space-y-2">
              {activeProtocol.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedStep?.id === step.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedStep(step)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Step {index + 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle step deletion
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{step.title}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Editor */}
          <div className="col-span-2">
            {selectedStep ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Step Title</label>
                  <input
                    type="text"
                    value={selectedStep.title}
                    onChange={(e) => handleStepUpdate(selectedStep.id, { title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={selectedStep.description}
                    onChange={(e) => handleStepUpdate(selectedStep.id, { description: e.target.value })}
                    className="w-full p-2 border rounded h-32"
                  />
                </div>

                {/* Materials List */}
                <div>
                  <label className="block text-sm font-medium mb-1">Materials</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStep.materials?.map((material, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                      >
                        <span>{material}</span>
                        <button
                          onClick={() => {
                            const newMaterials = [...(selectedStep.materials || [])];
                            newMaterials.splice(index, 1);
                            handleStepUpdate(selectedStep.id, { materials: newMaterials });
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const material = prompt("Enter material name");
                        if (material) {
                          handleStepUpdate(selectedStep.id, {
                            materials: [...(selectedStep.materials || []), material]
                          });
                        }
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                    >
                      + Add Material
                    </button>
                  </div>
                </div>

                {/* Safety Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Safety Notes</label>
                  <div className="space-y-2">
                    {selectedStep.safety?.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <span className="text-red-500">⚠️</span>
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => {
                            const newSafety = [...(selectedStep.safety || [])];
                            newSafety[index] = e.target.value;
                            handleStepUpdate(selectedStep.id, { safety: newSafety });
                          }}
                          className="flex-1 p-2 border rounded"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        handleStepUpdate(selectedStep.id, {
                          safety: [...(selectedStep.safety || []), ""]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      + Add Safety Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a step to edit or create a new one
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode && activeProtocol && (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">{activeProtocol.title}</h1>
          <div className="space-y-8">
            {activeProtocol.steps.map((step, index) => (
              <div key={step.id} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Step {index + 1}: {step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {step.materials?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc list-inside">
                      {step.materials.map((material, i) => (
                        <li key={i}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.safety?.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-red-600">Safety Notes:</h4>
                    <ul className="list-disc list-inside text-red-600">
                      {step.safety.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
