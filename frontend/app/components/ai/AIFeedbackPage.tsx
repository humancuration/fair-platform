// frontend/src/pages/AIFeedbackPage.tsx

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import api from '@/utils/api';
import { AxiosResponse } from 'axios';
import type { Recommendation } from '../../types';

const GET_RECOMMENDATIONS = gql`
  mutation GetRecommendations($profile: String!) {
    getRecommendations(profile: $profile) {
      id
      name
      commissionRate
    }
  }
`;

const AIFeedbackPage: React.FC = () => {
  const [profile, setProfile] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [getRecommendations, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(GET_RECOMMENDATIONS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await getRecommendations({ variables: { profile } });
      if (mutationData) {
        setRecommendations(mutationData.getRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations', error);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Affiliate Recommendations</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-sm font-medium mb-1">Describe Your Content and Audience</label>
        <textarea
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="e.g., I create travel vlogs targeting millennials interested in sustainable tourism..."
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Get Recommendations'}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Recommended Affiliate Programs</h2>
          <ul>
            {recommendations.map((program: any) => (
              <li key={program.id} className="mb-2">
                <strong>{program.name}</strong> - {program.commissionRate}% Commission
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIFeedbackPage;
