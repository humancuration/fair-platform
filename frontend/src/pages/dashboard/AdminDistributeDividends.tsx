import React, { useContext, useState, useCallback } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosResponse } from 'axios';
import { useToast } from '../hooks/useToast';
import Button from '../../components/common/Button';

const AdminDistributeDividends: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [isDistributing, setIsDistributing] = useState(false);
  const toast = useToast();

  const handleDistribute = useCallback(async () => {
    if (isDistributing || !window.confirm('Are you sure you want to distribute dividends?')) return;

    try {
      setIsDistributing(true);
      const res: AxiosResponse<{ message: string }> = await api.post(
        '/dividends/distribute',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to distribute dividends. Please try again later.');
    } finally {
      setIsDistributing(false);
    }
  }, [isDistributing, token, toast]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Distribute Dividends</h1>
      <Button
        onClick={handleDistribute}
        disabled={isDistributing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        {isDistributing ? 'Distributing...' : 'Distribute Now'}
      </Button>
    </div>
  );
};

export default AdminDistributeDividends;
