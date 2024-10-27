import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Spinner from './common/Spinner';

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

const GET_AI_JOBS = gql`
  query GetAIJobs($model: String!) {
    aiJobs(model: $model) {
      id
      title
      description
      complexity
      potentialImpact
      estimatedDuration
      urgency
      userEstimatedDifficulty
    }
  }
`;

const ACCEPT_JOB = gql`
  mutation AcceptJob($id: ID!, $model: String!) {
    acceptAIJob(id: $id, model: $model) {
      id
      status
    }
  }
`;

const AIJobMarketplace: React.FC = () => {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [newJob, setNewJob] = useState<Partial<AIJob>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const { data, loading: queryLoading } = useQuery(GET_AI_JOBS, {
    variables: { model: selectedModel }
  });

  const [acceptJobMutation] = useMutation(ACCEPT_JOB);

  useEffect(() => {
    if (data) {
      setJobs(data.aiJobs);
    }
  }, [data]);

  const submitNewJob = async () => {
    try {
      await axios.post('/api/ai-jobs', newJob);
      toast.success('Job submitted successfully!');
      setNewJob({});
    } catch (error) {
      console.error('Failed to submit job', error);
      toast.error('Failed to submit job. Please try again.');
    }
  };

  if (loading || queryLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Job Marketplace</h2>
      <div className="mb-4">
        <label htmlFor="model-select" className="block mb-2">Select AI Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="default">Default Model</option>
          <option value="advanced">Advanced Model (Longer processing time)</option>
        </select>
      </div>

      <h3 className="text-xl font-semibold mb-2">Submit New Job</h3>
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newJob.title || ''}
          onChange={(e) => setNewJob({...newJob, title: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newJob.description || ''}
          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <select
          value={newJob.urgency || 'standard'}
          onChange={(e) => setNewJob({...newJob, urgency: e.target.value as 'immediate' | 'standard' | 'flexible'})}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        />
        <Button onClick={submitNewJob}>Submit Job</Button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Available Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h4 className="text-lg font-semibold">{job.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{job.description}</p>
            <p>Complexity: {job.complexity}/10</p>
            <p>Potential Impact: {job.potentialImpact}/10</p>
            <p>Estimated Duration: {job.estimatedDuration}</p>
            <p>Urgency: {job.urgency}</p>
            <p>User Estimated Difficulty: {job.userEstimatedDifficulty}/10</p>
            <Button onClick={() => acceptJobMutation({ variables: { id: job.id, model: selectedModel } })} className="mt-2">Accept Job</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIJobMarketplace;
