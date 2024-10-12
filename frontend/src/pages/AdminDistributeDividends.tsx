import React, { useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { AxiosResponse } from 'axios';

const AdminDistributeDividends: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [isDistributing, setIsDistributing] = useState(false);

  const handleDistribute = async () => {
    if (!isDistributing && window.confirm('Are you sure you want to distribute dividends?')) {
      try {
        setIsDistributing(true);
        const res: AxiosResponse<{ message: string }> = await api.post(
          '/dividends/distribute',
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
        alert('Failed to distribute dividends. Please try again later.');
      } finally {
        setIsDistributing(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Distribute Dividends</h1>
      <button
        onClick={handleDistribute}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isDistributing}
      >
        {isDistributing ? 'Distributing...' : 'Distribute Now'}
      </button>
    </div>
  );
};

export default AdminDistributeDividends;