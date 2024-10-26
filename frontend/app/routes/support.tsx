import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { useLoaderData, useActionData } from '@remix-run/react';
import { motion } from 'framer-motion';
import SupportForm from '~/components/support/SupportForm';
import LiveChat from '~/components/support/LiveChat';
import KnowledgeBase from '~/components/support/KnowledgeBase';
import { requireUser } from '~/services/auth.server';
import { getSupportChannels, getPopularArticles } from '~/services/support.server';
import type { SupportArticle, SupportChannel } from '~/types';

interface LoaderData {
  supportChannels: SupportChannel[];
  popularArticles: SupportArticle[];
  userTimeZone: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const [supportChannels, popularArticles] = await Promise.all([
    getSupportChannels(),
    getPopularArticles(),
  ]);

  return json<LoaderData>({
    supportChannels,
    popularArticles,
    userTimeZone: user.timezone,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const type = formData.get('type');

  switch (type) {
    case 'support-ticket':
      return handleSupportTicket(formData);
    case 'chat-message':
      return handleChatMessage(formData);
    default:
      return json({ error: 'Invalid action type' }, { status: 400 });
  }
};

export default function Support() {
  const { supportChannels, popularArticles, userTimeZone } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-8">Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <SupportForm />
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our support team is available in your timezone ({userTimeZone})
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <LiveChat />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6">Knowledge Base</h2>
        <KnowledgeBase articles={popularArticles} />
      </motion.div>
    </motion.div>
  );
}
