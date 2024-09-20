// src/pages/AdminGrants.tsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Grant {
  id: number;
  applicantName: string;
  projectDescription: string;
  amountRequested: number;
  amountGranted: number;
}

const AdminGrants: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const res = await axios.get('/api/grants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGrants(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch grants');
      }
    };
    fetchGrants();
  }, [token]);

  const handleGrant = async (id: number) => {
    const amountGranted = parseFloat(prompt('Enter amount to grant:') || '0');
    if (amountGranted > 0) {
      try {
        const res = await axios.put(
          `/api/grants/${id}`,
          { amountGranted },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGrants(grants.map((grant) => (grant.id === id ? res.data : grant)));
        alert('Grant updated successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to update grant');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Manage Grants</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Applicant Name</th>
            <th className="px-4 py-2">Project Description</th>
            <th className="px-4 py-2">Amount Requested</th>
            <th className="px-4 py-2">Amount Granted</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {grants.map((grant) => (
            <tr key={grant.id} className="text-center">
              <td className="border px-4 py-2">{grant.applicantName}</td>
              <td className="border px-4 py-2">{grant.projectDescription}</td>
              <td className="border px-4 py-2">${grant.amountRequested.toFixed(2)}</td>
              <td className="border px-4 py-2">${grant.amountGranted.toFixed(2)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleGrant(grant.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Grant
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGrants;
