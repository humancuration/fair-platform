import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

interface FormWrapperProps {
  initialValues: { [key: string]: any };
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any, actions: any) => void;
  children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
          {children}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormWrapper;