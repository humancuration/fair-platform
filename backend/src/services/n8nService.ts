import axios from 'axios';
import logger from '../utils/logger';

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

interface N8NWorkflowResponse {
  data: {
    executionId: string;
    [key: string]: any;
  };
}

export const triggerN8nWorkflow = async (workflowId: string, payload: any): Promise<string> => {
  try {
    const response = await axios.post<N8NWorkflowResponse>(`${N8N_URL}/webhook/${workflowId}`, payload, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });
    logger.info(`Triggered n8n workflow ${workflowId}`);
    return response.data.data.executionId;
  } catch (error) {
    logger.error('Error triggering n8n workflow:', error);
    throw new Error(`Failed to trigger n8n workflow: ${error.message}`);
  }
};
