import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FormInput, FormTextArea, FormContainer } from '~/components/forms/FormElements';
import { FaPlus, FaTrash, FaCopy, FaDownload, FaUpload } from 'react-icons/fa';

interface FormField {
  id: string;
  type: "text" | "number" | "select" | "multiselect" | "date" | "time" | "location" | "media" | "scale" | "checkbox";
  label: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customRule?: string;
  };
  metadata?: {
    description?: string;
    unit?: string;
    precision?: number;
    category?: string;
  };
}

interface DataCollectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  validations: {
    requireLocation?: boolean;
    requirePhotos?: boolean;
    requireTimestamp?: boolean;
  };
}

const fieldTypes = {
  text: { icon: "📝", label: "Text Input" },
  number: { icon: "🔢", label: "Numeric Input" },
  select: { icon: "📋", label: "Single Choice" },
  multiselect: { icon: "☑️", label: "Multiple Choice" },
  date: { icon: "📅", label: "Date" },
  time: { icon: "⏰", label: "Time" },
  location: { icon: "📍", label: "Location" },
  media: { icon: "📷", label: "Media Upload" },
  scale: { icon: "⭐", label: "Rating Scale" },
  checkbox: { icon: "✅", label: "Checkbox" }
};

const templates = [
  {
    id: "nature-observation",
    name: "Nature Observation",
    description: "Record wildlife and plant observations",
    category: "ecology",
    fields: [
      { id: "species", type: "text", label: "Species Name", required: true },
      { id: "count", type: "number", label: "Count", required: true },
      { id: "behavior", type: "select", label: "Behavior", required: false, 
        options: ["Feeding", "Resting", "Moving", "Other"] },
      { id: "location", type: "location", label: "Location", required: true },
      { id: "photo", type: "media", label: "Photo Evidence", required: false }
    ]
  },
  {
    id: "weather-data",
    name: "Weather Monitoring",
    description: "Collect local weather data",
    category: "meteorology",
    fields: [
      { id: "temperature", type: "number", label: "Temperature (°C)", required: true },
      { id: "humidity", type: "number", label: "Humidity (%)", required: true },
      { id: "conditions", type: "multiselect", label: "Conditions", required: true,
        options: ["Sunny", "Cloudy", "Rainy", "Windy", "Foggy"] }
    ]
  }
];

export function DataCollectionForm() {
  const [activeTemplate, setActiveTemplate] = useState<DataCollectionTemplate | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const actionData = useActionData();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  const handleAddField = (type: keyof typeof fieldTypes) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${fieldTypes[type].label}`,
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  const handleFieldUpdate = (id: string, updates: Partial<FormField>) => {
    setFormFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const handleRemoveField = (id: string) => {
    setFormFields(fields => fields.filter(field => field.id !== id));
  };

  const handleTemplateSelect = (template: DataCollectionTemplate) => {
    setActiveTemplate(template);
    setFormFields(template.fields);
  };

  const handleExport = () => {
    const formConfig = {
      fields: formFields,
      metadata: {
        created: new Date().toISOString(),
        version: "1.0"
      }
    };
    
    const blob = new Blob([JSON.stringify(formConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-collection-form.json';
    a.click();
  };

  return (
    <div className="data-collection-form p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Data Collection Form Builder ✨
          </h2>
          <p className="text-gray-600 mt-1">Create custom forms for your research</p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            {previewMode ? "Edit Form" : "Preview Form"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-2"
          >
            <FaDownload /> Export
          </motion.button>
        </div>
      </div>

      {/* Template Selection */}
      {!activeTemplate && (
        <div className="mb-8">
          <h3 className="font-bold mb-4">Start with a Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <motion.div
                key={template.id}
                className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTemplateSelect(template)}
              >
                <h4 className="font-medium mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.fields.map(field => (
                    <span
                      key={field.id}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {fieldTypes[field.type].icon} {field.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Form Builder */}
      {!previewMode ? (
        <div className="space-y-6">
          {/* Field Type Selection */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(fieldTypes).map(([type, info]) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddField(type as keyof typeof fieldTypes)}
                className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Field List */}
          <div className="space-y-4">
            {formFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{fieldTypes[field.type].icon}</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                      className="font-medium bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Field Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                    />
                    Required Field
                  </label>

                  {(field.type === "select" || field.type === "multiselect") && (
                    <div>
                      <label className="text-sm font-medium">Options</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {field.options?.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(field.options || [])];
                              newOptions[optionIndex] = e.target.value;
                              handleFieldUpdate(field.id, { options: newOptions });
                            }}
                            className="px-2 py-1 border rounded text-sm"
                          />
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [...(field.options || []), "New Option"];
                            handleFieldUpdate(field.id, { options: newOptions });
                          }}
                          className="px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // Preview Mode
        <FormContainer
          as={Form}
          method="post"
          className="max-w-2xl mx-auto"
        >
          {formFields.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <FormInput
                    key={field.id}
                    name={field.id}
                    label={field.label}
                    required={field.required}
                  />
                );
              case "number":
                return (
                  <FormInput
                    key={field.id}
                    name={field.id}
                    label={field.label}
                    type="number"
                    required={field.required}
                  />
                );
              // Add other field type renderers
              default:
                return null;
            }
          })}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </motion.button>
        </FormContainer>
      )}
    </div>
  );
}
