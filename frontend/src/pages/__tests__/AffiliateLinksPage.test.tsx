// frontend/src/pages/__tests__/AffiliateLinksPage.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AffiliateLinksPage from '../dashboard/AffiliateLinksPage';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import api from '@api/api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AffiliateLinksPage', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          generatedLink: 'https://yourplatform.com/affiliate/abc123',
          customAlias: 'Buy Now',
          affiliateProgram: { name: 'Test Affiliate Program', commissionRate: 10 },
          clicks: 100,
          conversions: 10,
        },
      ],
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id: 2,
        generatedLink: 'https://yourplatform.com/affiliate/def456',
        customAlias: 'Shop Here',
        affiliateProgram: { name: 'Test Affiliate Program', commissionRate: 10 },
        clicks: 0,
        conversions: 0,
      },
    });
  });

  test('renders affiliate links', async () => {
    render(
      <Provider store={store}>
        <AffiliateLinksPage />
      </Provider>
    );

    expect(screen.getByText(/Manage Affiliate Links/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });
  });

  test('creates a new affiliate link', async () => {
    render(
      <Provider store={store}>
        <AffiliateLinksPage />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('https://example.com/product'), { target: { value: 'https://example.com/new-product' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., Shop Now'), { target: { value: 'New Product' } });
    fireEvent.click(screen.getByText('Create Affiliate Link'));

    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument();
    });
  });
});
