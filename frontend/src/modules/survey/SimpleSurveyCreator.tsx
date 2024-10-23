import React from 'react';
import { useQuery } from '@apollo/client';
import { SURVEY_TEMPLATES } from '../../graphql/surveyQueries';
import { FormWrapper } from '../forms/FormWrapper';
import { motion } from 'framer-motion';

export const SimpleSurveyCreator: React.FC = () => {
  const { data: templates } = useQuery(SURVEY_TEMPLATES);

  return (
    <FormWrapper
      title="Create New Survey"
      initialValues={{
        name: '',
        template: '',
        questions: []
      }}
      onSubmit={async (values) => {
        // Handle submission
      }}
    >
      <div className="space-y-6">
        {/* Quick Start Templates */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates?.surveyTemplates.map(template => (
            <motion.div
              key={template.id}
              className="p-4 border rounded-lg cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="font-bold">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              <div className="mt-2 text-xs text-blue-500">
                {template.questions.length} questions
              </div>
            </motion.div>
          ))}
        </section>

        {/* Simple Question Builder */}
        <section className="space-y-4">
          <h3 className="font-bold">Add Questions</h3>
          <div className="flex gap-2">
            <button className="p-2 border rounded">
              Multiple Choice
            </button>
            <button className="p-2 border rounded">
              Text Answer
            </button>
            <button className="p-2 border rounded">
              Rating Scale
            </button>
          </div>
        </section>
      </div>
    </FormWrapper>
  );
};
