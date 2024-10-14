import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './common/Button';

interface CommunityWishlistItemProps {
  item: {
    id: string;
    user: string;
    name: string;
    description: string;
    image: string;
    targetAmount: number;
    currentAmount: number;
    date: string;
  };
  onContribute: (amount: number) => void;
}

const CommunityWishlistItem: React.FC<CommunityWishlistItemProps> = ({ item, onContribute }) => {
  const [contribution, setContribution] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const progress = (item.currentAmount / item.targetAmount) * 100;

  const handleContributeClick = () => {
    if (contribution > 0) {
      onContribute(contribution);
      setContribution(0);
    }
  };

  return (
    <ItemContainer
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <ItemImage src={item.image} alt={item.name} />
      <ItemContent>
        <ItemName>{item.name}</ItemName>
        <ItemDescription>{item.description}</ItemDescription>
        <ProgressBar>
          <ProgressFill
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>
        <ItemStats>
          <span>
            ${item.currentAmount.toFixed(2)} / ${item.targetAmount.toFixed(2)}
          </span>
          <span>{progress.toFixed(0)}% Funded</span>
        </ItemStats>
        <AnimatePresence>
          {isHovered && (
            <ContributionInput
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="number"
                min="1"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                placeholder="Amount"
              />
            </ContributionInput>
          )}
        </AnimatePresence>
        <ContributeButton onClick={handleContributeClick}>
          {isHovered ? `Contribute $${contribution || ''}` : 'Contribute'}
        </ContributeButton>
      </ItemContent>
    </ItemContainer>
  );
};

const ItemContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemContent = styled.div`
  padding: 1rem;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.progressBackground};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.progressFill};
`;

const ItemStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const ContributionInput = styled(motion.div)`
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const ContributeButton = styled(Button)`
  width: 100%;
`;

export default CommunityWishlistItem;
