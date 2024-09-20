// src/pages/ApplyGrant.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ApplyGrant: React.FC = () => {
  const [applicantName, setApplicantName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [amountRequested, setAmountRequested] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/grants', {
        applicantName,
        projectDescription,
        amountRequested,
      });
      alert('Grant application submitted successfully!');
      setApplicantName('');
      setProjectDescription('');
      setAmountRequested(0);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grant application');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Apply for a Micro-Grant</h1>
      <form onSubmit={handleSubmit} className="w-1/2 mx-auto">
        <input
          type="text"
          placeholder="Your Name"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        ></textarea>
        <input
          type="number"
          placeholder="Amount Requested"
          value={amountRequested}
          onChange={(e) => setAmountRequested(parseFloat(e.target.value))}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyGrant;
