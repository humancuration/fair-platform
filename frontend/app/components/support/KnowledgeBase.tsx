import { motion } from 'framer-motion';
import { useState } from 'react';

interface KnowledgeBaseProps {
  articles: Array<{
    id: string;
    title: string;
    content: string;
    viewCount: number;
  }>;
}

export default function KnowledgeBase({ articles }: KnowledgeBaseProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <motion.div
          key={article.id}
          initial={false}
          animate={{ height: expandedId === article.id ? 'auto' : '60px' }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
            className="w-full p-4 text-left flex justify-between items-center"
          >
            <h3 className="font-medium">{article.title}</h3>
            <motion.span
              animate={{ rotate: expandedId === article.id ? 180 : 0 }}
              className="text-gray-500"
            >
              ▼
            </motion.span>
          </button>
          
          <motion.div
            initial={false}
            animate={{ opacity: expandedId === article.id ? 1 : 0 }}
            className="px-4 pb-4"
          >
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className="mt-2 text-sm text-gray-500">
              Views: {article.viewCount}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
