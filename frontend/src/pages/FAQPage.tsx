import React from 'react';
import Layout from '../components/Layout';
import Accordion from '../components/common/Accordion';

const FAQPage: React.FC = () => {
  const faqData = [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order by adding items to your cart and proceeding to checkout.',
    },
    {
      question: 'What is the return policy?',
      answer: 'Returns are accepted within 30 days of purchase with a valid receipt.',
    },
    // Add more FAQs as needed
  ];

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Accordion key={index} title={faq.question}>
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;