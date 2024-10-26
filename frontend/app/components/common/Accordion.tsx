import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

export default function Accordion({ 
  items, 
  allowMultiple = false,
  className = ''
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prevOpenItems) => {
      if (allowMultiple) {
        return prevOpenItems.includes(id)
          ? prevOpenItems.filter(item => item !== id)
          : [...prevOpenItems, id];
      }
      return prevOpenItems.includes(id) ? [] : [id];
    });
  }, [allowMultiple]);

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={false}
            className="border rounded-lg overflow-hidden dark:border-gray-700"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-800"
            >
              <span className="font-medium text-left">{item.title}</span>
              <motion.span
                animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                className="text-gray-500"
              >
                ▼
              </motion.span>
            </button>
            
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: openItems.includes(item.id) ? 'auto' : 0 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                {item.content}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
