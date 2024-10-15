import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AccordionItem from './AccordionItem'; // Import the AccordionItem component
import './Accordion.css'; // Import styles if needed

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionGroupProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prevOpenItems) => {
      if (allowMultiple) {
        return prevOpenItems.includes(id)
          ? prevOpenItems.filter((item) => item !== id)
          : [...prevOpenItems, id];
      } else {
        return prevOpenItems.includes(id) ? [] : [id];
      }
    });
  };

  return (
    <ul className="accordion">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          data={item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </ul>
  );
};

export default AccordionGroup;
