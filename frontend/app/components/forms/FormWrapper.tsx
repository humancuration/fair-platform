import React from 'react';
import { Formik, Form } from 'formik';
import { AnimatedContainer } from '../common/AnimatedContainer';
import { motion } from 'framer-motion';

interface FormWrapperProps {
  initialValues: { [key: string]: any };
  validationSchema: any;
  onSubmit: (values: any, actions: any) => void;
  children: React.ReactNode;
  title?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  title
}) => {
  return (
    <AnimatedContainer
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-lg mx-auto p-6 rounded shadow"
    >
      {title && (
        <motion.h2 
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h2>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {children}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </motion.button>
          </Form>
        )}
      </Formik>
    </AnimatedContainer>
  );
};

export default FormWrapper;
