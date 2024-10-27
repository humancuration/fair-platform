import { useState } from "react";
import { motion } from "framer-motion";
import type { ComponentData } from "~/types/minsite";

interface LayoutEditorProps {
  components: ComponentData[];
  onComponentsChange: (components: ComponentData[]) => void;
}

export function LayoutEditor({ components, onComponentsChange }: LayoutEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onComponentsChange(items);
  };

  const handleStyleChange = (componentId: string, style: Record<string, string>) => {
    const updatedComponents = components.map(component => 
      component.type === componentId 
        ? { ...component, style: { ...component.style, ...style } }
        : component
    );
    onComponentsChange(updatedComponents);
  };

  return (
    <div className="layout-editor">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Layout</h3>
        <button
          onClick={() => setSelectedComponent(null)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Add Component
        </button>
      </div>

      <motion.div
        layout
        className="space-y-4"
      >
        {components.map((component, index) => (
          <motion.div
            key={component.type}
            layout
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            className={`p-4 bg-white rounded-lg shadow cursor-move ${
              selectedComponent === component.type ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedComponent(component.type)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{component.type}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newComponents = [...components];
                  newComponents.splice(index, 1);
                  onComponentsChange(newComponents);
                }}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>

            {selectedComponent === component.type && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-2"
              >
                <input
                  type="text"
                  placeholder="Width"
                  value={component.style?.width || ""}
                  onChange={(e) => handleStyleChange(component.type, { width: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Margin"
                  value={component.style?.margin || ""}
                  onChange={(e) => handleStyleChange(component.type, { margin: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Padding"
                  value={component.style?.padding || ""}
                  onChange={(e) => handleStyleChange(component.type, { padding: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
