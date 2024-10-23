// src/pages/ApplyGrant.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, useTransition } from '@remix-run/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import type { ActionFunction } from '@remix-run/node';

interface GrantApplication {
  applicantName: string;
  projectDescription: string;
  amountRequested: number;
  category: string;
  timeline: string;
}

const validationSchema = Yup.object({
  applicantName: Yup.string().required('Name is required'),
  projectDescription: Yup.string()
    .min(100, 'Description must be at least 100 characters')
    .required('Description is required'),
  amountRequested: Yup.number()
    .min(100, 'Minimum amount is $100')
    .max(10000, 'Maximum amount is $10,000')
    .required('Amount is required'),
  category: Yup.string().required('Category is required'),
  timeline: Yup.string().required('Timeline is required'),
});

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // Handle form submission server-side
};

const ApplyGrant: React.FC = () => {
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <Formik
        initialValues={{
          applicantName: '',
          projectDescription: '',
          amountRequested: 0,
          category: '',
          timeline: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          // Handle form submission
        }}
      >
        {/* Form implementation */}
      </Formik>
    </motion.div>
  );
};

export default ApplyGrant;
