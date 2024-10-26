import { json, redirect, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { prisma } from '../db.server';
import { requireUser } from '../auth.server';
import * as Yup from 'yup';

interface ActionData {
  errors?: {
    applicantName?: string;
    projectDescription?: string;
    amountRequested?: string;
    category?: string;
    timeline?: string;
  };
  success?: boolean;
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

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const validData = await validationSchema.validate(data, { abortEarly: false });
    
    await prisma.grant.create({
      data: {
        applicantId: user.id,
        title: validData.applicantName,
        projectDescription: validData.projectDescription,
        amountRequested: validData.amountRequested,
        status: 'pending',
      }
    });

    return redirect('/dashboard/grants');
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.reduce((acc, err) => ({
        ...acc,
        [err.path!]: err.message
      }), {});
      return json<ActionData>({ errors });
    }
    return json<ActionData>({ 
      errors: { projectDescription: 'An error occurred while submitting your application' }
    });
  }
};

export default function ApplyGrant() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <Form method="post" className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">Apply for Grant</h1>

        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="applicantName"
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
          {actionData?.errors?.applicantName && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.applicantName}
            </p>
          )}
        </div>

        {/* Add other form fields */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </Form>
    </motion.div>
  );
}
