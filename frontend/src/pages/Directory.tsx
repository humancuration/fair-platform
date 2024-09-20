// src/pages/Directory.tsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  referralTerms: string;
  generosityScore: number;
}

const Directory: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch companies');
      }
    };
    fetchCompanies();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Company Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div key={company.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-gray-600">{company.industry}</p>
            <p className="mt-2">{company.description}</p>
            <p className="mt-2"><strong>Referral Terms:</strong> {company.referralTerms}</p>
            <p className="mt-2"><strong>Generosity Score:</strong> {company.generosityScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;
