import React from 'react';

interface PetitionListProps {
  groupId: number;
  onVote: (petitionId: number, voteType: 'Upvote' | 'Downvote') => void;
}

const PetitionList: React.FC<PetitionListProps> = ({ groupId, onVote }) => {
  return (
    <div className="space-y-4">
      {/* Add petition list functionality here */}
      <p className="text-gray-600">Petitions feature coming soon...</p>
    </div>
  );
};

export default PetitionList;
