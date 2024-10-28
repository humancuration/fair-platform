import { Request, Response } from 'express';
import axios from 'axios';

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

export const triggerWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId, payload } = req.body;
    const response = await axios.post(`${N8N_URL}/webhook/${workflowId}`, payload, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    res.status(500).json({ message: 'Error triggering workflow' });
  }
};

export const getWorkflowStatus = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const response = await axios.get(`${N8N_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting n8n workflow status:', error);
    res.status(500).json({ message: 'Error getting workflow status' });
  }
};