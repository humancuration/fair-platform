import axios, { AxiosInstance } from 'axios';
import logger from '../utils/logger';

const MAUTIC_URL = process.env.MAUTIC_URL;
const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;

interface MauticContact {
  firstname: string;
  lastname: string;
  email: string;
  [key: string]: any;
}

interface MauticResponse {
  contact: {
    id: number;
    [key: string]: any;
  };
}

const mauticApi: AxiosInstance = axios.create({
  baseURL: MAUTIC_URL,
  auth: {
    username: MAUTIC_USERNAME!,
    password: MAUTIC_PASSWORD!,
  },
});

export const createMauticContact = async (contactData: MauticContact): Promise<number> => {
  try {
    const response = await mauticApi.post<MauticResponse>('/api/contacts/new', contactData);
    logger.info(`Created Mautic contact: ${response.data.contact.id}`);
    return response.data.contact.id;
  } catch (error) {
    logger.error('Error creating Mautic contact:', error);
    throw new Error('Failed to create Mautic contact');
  }
};

export const addContactToSegment = async (contactId: number, segmentId: number): Promise<void> => {
  try {
    await mauticApi.post(`/api/segments/${segmentId}/contact/${contactId}/add`);
    logger.info(`Added contact ${contactId} to segment ${segmentId}`);
  } catch (error) {
    logger.error(`Error adding contact to Mautic segment:`, error);
    throw new Error('Failed to add contact to Mautic segment');
  }
};

export const triggerCampaign = async (campaignId: number, contactId: number): Promise<void> => {
  try {
    await mauticApi.post(`/api/campaigns/${campaignId}/contact/${contactId}/trigger`);
    logger.info(`Triggered campaign ${campaignId} for contact ${contactId}`);
  } catch (error) {
    logger.error('Error triggering Mautic campaign:', error);
    throw new Error('Failed to trigger Mautic campaign');
  }
};
