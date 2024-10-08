// frontend/src/components/__tests__/AffiliateLinkCard.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AffiliateLinkCard from '../affiliate/AffiliateLinkCard';

const mockLink = {
  id: 1,
  originalLink: 'https://example.com/product',
  generatedLink: 'https://yourplatform.com/a/1234-5678',
  customAlias: 'my-product',
  affiliateProgram: {
    name: 'Summer Sale',
    commissionRate: 10,
  },
};

test('renders AffiliateLinkCard correctly', () => {
  const { getByText } = render(<AffiliateLinkCard link={mockLink} />);
  
  expect(getByText('Summer Sale')).toBeInTheDocument();
  expect(getByText('Commission: 10%')).toBeInTheDocument();
  expect(getByText('https://example.com/product')).toBeInTheDocument();
  expect(getByText('https://yourplatform.com/a/1234-5678')).toBeInTheDocument();
});

test('handles delete button click', () => {
  const { getByText } = render(<AffiliateLinkCard link={mockLink} />);
  
  const deleteButton = getByText('Delete');
  fireEvent.click(deleteButton);
  
  // Add assertions based on your delete functionality
});
