import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaHistory, FaGlobeAmericas } from 'react-icons/fa';

interface EducationalContent {
  musicTheory?: string[];
  culturalContext?: string[];
  historicalInfo?: string[];
}

interface EducationalOverlayProps {
  content: EducationalContent;
  isPlaying: boolean;
}

type ContentType = 'theory' | 'cultural' | 'historical';

const contentMapping: Record<ContentType, keyof EducationalContent> = {
  theory: 'musicTheory',
  cultural: 'culturalContext',
  historical: 'historicalInfo'
};

export const EducationalOverlay: React.FC<EducationalOverlayProps> = ({
  content,
  isPlaying
}) => {
  const [activeTab, setActiveTab] = useState<ContentType>('theory');

  const getContent = (type: ContentType) => content[contentMapping[type]] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 1 : 0 }}
      className="absolute top-0 right-0 bg-black/50 backdrop-blur-md p-4 rounded-l-lg max-w-md"
    >
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 ${activeTab === 'theory' ? 'text-primary' : ''}`}
        >
          <FaGraduationCap /> Theory
        </button>
        <button
          onClick={() => setActiveTab('cultural')}
          className={`flex items-center gap-2 ${activeTab === 'cultural' ? 'text-primary' : ''}`}
        >
          <FaGlobeAmericas /> Cultural
        </button>
        <button
          onClick={() => setActiveTab('historical')}
          className={`flex items-center gap-2 ${activeTab === 'historical' ? 'text-primary' : ''}`}
        >
          <FaHistory /> Historical
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-2"
        >
          {getContent(activeTab).map((item: string, index: number) => (
            <p key={index} className="text-sm">{item}</p>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
