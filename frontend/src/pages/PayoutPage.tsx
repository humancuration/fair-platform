import React, { useState } from 'react';
import api from '../api/api';

const PayoutPage: React.FC = () => {
  const [linkId, setLinkId] = useState('');
  const [status, setStatus] = useState('');

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/payouts', { linkId });
      setStatus(`Payout Status: ${response.data.payout.status}`);
    } catch (error) {
      console.error('Error initiating payout', error);
      setStatus('Error initiating payout');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Initiate Payout</h1>
      <form onSubmit={handlePayout} className="mb-6">
        <label className="block text-sm font-medium mb-1">Affiliate Link ID</label>
        <input
          type="text"
          value={linkId}
          onChange={(e) => setLinkId(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="e.g., 1"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Initiate Payout
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default PayoutPage;
