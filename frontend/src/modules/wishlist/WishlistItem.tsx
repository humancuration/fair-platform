import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { WishlistItem as WishlistItemType } from '../../types/wishlist';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove }) => {
  return (
    <ItemContainer>
      <ItemImage src={item.image} alt={item.name} />
      <ItemContent>
        <ItemName>{item.name}</ItemName>
        <ItemDescription>{item.description}</ItemDescription>
        <Button onClick={onRemove} variant="secondary">
          Remove
        </Button>
      </ItemContent>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
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

export default WishlistItem;
