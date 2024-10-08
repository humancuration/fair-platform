import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AIJob {
  id: string;
  title: string;
  description: string;
  complexity: number;
  potentialImpact: number;
  estimatedDuration: string;
  urgency: 'immediate' | 'standard' | 'flexible';
  userEstimatedDifficulty: number;
}

const AIJobMarketplace: React.FC = () => {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [newJob, setNewJob] = useState<Partial<AIJob>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/ai-jobs', {
        params: { model: selectedModel }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch AI jobs', error);
    }
  };

  const acceptJob = async (id: string) => {
    try {
      await axios.post(`/api/accept-job/${id}`, { model: selectedModel });
      alert('Job accepted successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Failed to accept job', error);
    }
  };

  const submitNewJob = async () => {
    try {
      await axios.post('/api/ai-jobs', newJob);
      alert('Job submitted successfully!');
      setNewJob({});
      fetchJobs();
    } catch (error) {
      console.error('Failed to submit job', error);
    }
  };

  return (
    <div>
      <h2>AI Job Marketplace</h2>
      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="default">Default Model</option>
        <option value="advanced">Advanced Model (Longer processing time)</option>
      </select>

      <h3>Submit New Job</h3>
      <input
        type="text"
        placeholder="Title"
        value={newJob.title || ''}
        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
      />
      <textarea
        placeholder="Description"
        value={newJob.description || ''}
        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
      />
      <select
        value={newJob.urgency || 'standard'}
        onChange={(e) => setNewJob({...newJob, urgency: e.target.value as 'immediate' | 'standard' | 'flexible'})}
      >
        <option value="immediate">Immediate</option>
        <option value="standard">Standard</option>
        <option value="flexible">Flexible</option>
      </select>
      <input
        type="number"
        placeholder="Estimated Difficulty (1-10)"
        min="1"
        max="10"
        value={newJob.userEstimatedDifficulty || ''}
        onChange={(e) => setNewJob({...newJob, userEstimatedDifficulty: parseInt(e.target.value)})}
      />
      <button onClick={submitNewJob}>Submit Job</button>

      <h3>Available Jobs</h3>
      {jobs.map((job) => (
        <div key={job.id}>
          <h4>{job.title}</h4>
          <p>{job.description}</p>
          <p>Complexity: {job.complexity}/10</p>
          <p>Potential Impact: {job.potentialImpact}/10</p>
          <p>Estimated Duration: {job.estimatedDuration}</p>
          <p>Urgency: {job.urgency}</p>
          <p>User Estimated Difficulty: {job.userEstimatedDifficulty}/10</p>
          <button onClick={() => acceptJob(job.id)}>Accept Job</button>
        </div>
      ))}
    </div>
  );
};

export default AIJobMarketplace;