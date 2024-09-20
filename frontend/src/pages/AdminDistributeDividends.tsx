// src/pages/AdminDistributeDividends.tsx
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDistributeDividends: React.FC = () => {
  const { token } = useContext(AuthContext);

  const handleDistribute = async () => {
    if (window.confirm('Are you sure you want to distribute dividends?')) {
      try {
        const res = await axios.post(
          '/api/dividends/distribute',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert('Failed to distribute dividends');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Distribute Dividends</h1>
      <button
        onClick={handleDistribute}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Distribute Now
      </button>
    </div>
  );
};

export default AdminDistributeDividends;
