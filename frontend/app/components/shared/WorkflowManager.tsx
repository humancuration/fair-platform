import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

const WorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await api.get('/n8n/workflows');
      setWorkflows(response.data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const triggerWorkflow = async (workflowId: string) => {
    try {
      await api.post('/n8n/trigger', { workflowId, payload: {} });
      alert('Workflow triggered successfully!');
    } catch (error) {
      console.error('Error triggering workflow:', error);
    }
  };

  return (
    <div>
      <h2>Workflow Manager</h2>
      <ul>
        {workflows.map(workflow => (
          <li key={workflow.id}>
            {workflow.name}
            <button onClick={() => triggerWorkflow(workflow.id)}>Trigger</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkflowManager;