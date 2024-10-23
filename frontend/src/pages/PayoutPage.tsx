import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TextInput from '../components/forms/TextInput';
import Button from '../components/common/Button';
import { requireUser } from '../utils/auth.server';
import type { PayoutStatus } from '../types';

interface ActionData {
  status: PayoutStatus;
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const linkId = formData.get('linkId');

  try {
    const response = await initiatePayout({ userId: user.id, linkId });
    return json<ActionData>({ status: response.status });
  } catch (error) {
    return json<ActionData>(
      { status: 'error', error: 'Failed to initiate payout' },
      { status: 400 }
    );
  }
};

const PayoutPage = () => {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Initiate Payout</h1>
      <Form method="post" className="max-w-md mx-auto">
        <TextInput
          label="Affiliate Link ID"
          name="linkId"
          type="text"
          placeholder="e.g., 1"
          required
          disabled={isSubmitting}
        />
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isSubmitting ? 'Processing...' : 'Initiate Payout'}
        </Button>
      </Form>

      {actionData?.status && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 p-4 rounded ${
            actionData.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {actionData.error || `Payout Status: ${actionData.status}`}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PayoutPage;
