import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

interface Dividend {
  id: number;
  amount: number;
  recipientId: number;
}

const Dividends: React.FC = () => {
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDividends = async () => {
      try {
        const res = await api.get('/dividends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDividends(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch dividends');
      }
    };
    fetchDividends();
  }, [token]);

  const totalDividends = dividends.reduce((acc, div) => acc + div.amount, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Your Dividends</h1>
      <p className="text-xl">Total Dividends Received: ${totalDividends.toFixed(2)}</p>
      <ul className="mt-4">
        {dividends.map((div) => (
          <li key={div.id} className="border p-2 rounded mb-2">
            Amount: ${div.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dividends;
