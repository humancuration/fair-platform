import { json, type ActionFunction, type LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import TextInput from '../components/forms/TextInput';
import Button from '../components/common/Button';
import { authenticateUser, getUser } from '../auth.server';

interface ActionData {
  error?: string;
  success?: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  // Redirect if already authenticated
  const user = await getUser(request);
  if (user) {
    return redirect('/dashboard');
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const { user, headers } = await authenticateUser({ email, password });
    return redirect('/dashboard', {
      headers
    });
  } catch (error) {
    return json<ActionData>({ 
      error: 'Invalid credentials'
    });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
    >
      <Form method="post" className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {actionData?.error && (
          <div className="mb-4 p-2 text-red-500 bg-red-50 rounded">
            {actionData.error}
          </div>
        )}

        <TextInput
          label="Email"
          name="email"
          type="email"
          required
          disabled={isSubmitting}
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          required
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </motion.div>
  );
}
