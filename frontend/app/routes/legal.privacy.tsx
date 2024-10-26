import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { getPrivacyPolicy } from '~/services/legal.server';

interface LoaderData {
  privacy: {
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

export const loader: LoaderFunction = async () => {
  const privacy = await getPrivacyPolicy();
  return json<LoaderData>({ privacy });
};

export default function PrivacyPolicy() {
  const { privacy } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date(privacy.lastUpdated).toLocaleDateString()}
        </p>

        <div className="prose dark:prose-invert max-w-none">
          {privacy.sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
