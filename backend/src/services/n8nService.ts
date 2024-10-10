import axios from 'axios';

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

export const triggerN8nWorkflow = async (workflowId: string, payload: any) => {
  try {
    const response = await axios.post(`${N8N_URL}/webhook/${workflowId}`, payload, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    throw error;
  }
};