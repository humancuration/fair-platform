import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getFAQs } from '~/services/faq.server';
import type { FAQ } from '~/types';

interface LoaderData {
  faqs: FAQ[];
  categories: string[];
}

export const loader: LoaderFunction = async () => {
  const faqs = await getFAQs();
  const categories = [...new Set(faqs.map(faq => faq.category))];
  return json<LoaderData>({ faqs, categories });
};

export default function FAQPage() {
  const { faqs, categories } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded ${
              selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {category}
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-xl font-semibold mb-4">{faq.question}</h2>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
