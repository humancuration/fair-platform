import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaVoteYea, FaComments, FaShare } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface PetitionListProps {
  groupId: number;
  onVote: (petitionId: number, voteType: 'Upvote' | 'Downvote') => void;
}

interface Petition {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  votes: number;
  comments: number;
  deadline: Date;
  status: 'active' | 'completed' | 'expired';
}

const PetitionList: React.FC<PetitionListProps> = ({ groupId, onVote }) => {
  const { t } = useTranslation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t('petitions.title')}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPencilAlt className="mr-2" />
          {t('petitions.create')}
        </motion.button>
      </div>

      {/* Petition Categories/Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Education', 'Infrastructure', 'Research', 'Community'].map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap"
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Petitions List */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex items-center justify-center space-x-4 text-gray-500">
            <FaVoteYea className="text-2xl" />
            <p>{t('petitions.comingSoon')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PetitionList;
