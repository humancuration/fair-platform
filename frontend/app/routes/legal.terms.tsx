import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { getTermsOfService } from '~/services/legal.server';

interface LoaderData {
  terms: {
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

export const loader: LoaderFunction = async () => {
  const terms = await getTermsOfService();
  return json<LoaderData>({ terms });
};

export default function TermsOfService() {
  const { terms } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date(terms.lastUpdated).toLocaleDateString()}
        </p>

        <div className="prose dark:prose-invert max-w-none">
          {terms.sections.map((section, index) => (
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
