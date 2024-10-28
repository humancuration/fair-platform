import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CompanyListingProps {
  companyName: string;
  description: string;
  companyId: string;
  handleFollowCompany: (id: string) => void;
}

const CompanyListing: React.FC<CompanyListingProps> = ({ companyName, description, companyId, handleFollowCompany }) => (
  <ListingContainer
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
  >
    <CompanyName className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{companyName}</CompanyName>
    <Description className="text-gray-600 dark:text-gray-300 mb-4">{description}</Description>
    <FollowButton
      onClick={() => handleFollowCompany(companyId)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Follow ${companyName}`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </FollowButton>
  </ListingContainer>
);

const ListingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

const CompanyName = styled.h3`
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  flex-grow: 1;
`;

const FollowButton = styled(motion.button)`
  align-self: flex-end;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export default CompanyListing;
