import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useLoaderData, Form, useActionData } from '@remix-run/react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SupportForm from '../components/SupportForm';
import GroupSupportChannels from '../components/groups/GroupSupportChannels';
import LiveChat from '../components/support/LiveChat';
import KnowledgeBase from '../components/support/KnowledgeBase';
import { useTranslation } from 'react-i18next';
import type { SupportArticle, SupportChannel } from '../types';

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

const SupportPage: React.FC = () => {
  const { supportChannels, popularArticles, userTimeZone } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const { t } = useTranslation();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-3xl font-bold mb-8">{t('support.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">{t('support.contactUs')}</h2>
            <SupportForm />
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{t('support.operatingHours')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('support.availabilityMessage', { timezone: userTimeZone })}
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
          <h2 className="text-2xl font-bold mb-6">{t('support.knowledgeBase')}</h2>
          <KnowledgeBase articles={popularArticles} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">{t('support.groupSupport')}</h2>
          <GroupSupportChannels channels={supportChannels} />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default SupportPage;
