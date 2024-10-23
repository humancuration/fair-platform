import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Accordion from '../components/common/Accordion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface LoaderData {
  faqs: FAQ[];
  categories: string[];
}

export const loader: LoaderFunction = async () => {
  const faqs = await getFAQs(); // Implement this in your API
  const categories = [...new Set(faqs.map(faq => faq.category))];
  return json<LoaderData>({ faqs, categories });
};

const FAQPage: React.FC = () => {
  const { faqs, categories } = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-3xl font-bold mb-8">{t('faq.title')}</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded ${
              selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {t('faq.all')}
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {t(`faq.categories.${category}`)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion 
                  title={faq.question}
                  defaultOpen={index === 0}
                >
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </Accordion>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FAQPage;
