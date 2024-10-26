import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { requireUser } from '~/services/auth.server';
import { initiatePayout } from '~/services/payouts.server';
import type { PayoutStatus } from '~/types';

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

  if (!linkId) {
    return json<ActionData>(
      { status: 'error', error: 'Link ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await initiatePayout({ userId: user.id, linkId: linkId.toString() });
    return json<ActionData>({ status: response.status });
  } catch (error) {
    return json<ActionData>(
      { status: 'error', error: 'Failed to initiate payout' },
      { status: 500 }
    );
  }
};

export default function Payouts() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Initiate Payout</h1>

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="linkId" className="block text-sm font-medium mb-1">
              Affiliate Link ID
            </label>
            <input
              id="linkId"
              name="linkId"
              type="text"
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., 1"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Initiate Payout'}
          </button>
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
    </div>
  );
}
