import axios from 'axios';

const MAUTIC_URL = process.env.MAUTIC_URL;
const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;

const mauticApi = axios.create({
  baseURL: MAUTIC_URL,
  auth: {
    username: MAUTIC_USERNAME,
    password: MAUTIC_PASSWORD,
  },
});

export const createMauticContact = async (contactData: any) => {
  try {
    const response = await mauticApi.post('/api/contacts/new', contactData);
    return response.data;
  } catch (error) {
    console.error('Error creating Mautic contact:', error);
    throw error;
  }
};

export const addContactToSegment = async (contactId: number, segmentId: number) => {
  try {
    const response = await mauticApi.post(`/api/segments/${segmentId}/contact/${contactId}/add`);
    return response.data;
  } catch (error) {
    console.error('Error adding contact to Mautic segment:', error);
    throw error;
  }
};

export const triggerCampaign = async (campaignId: number, contactId: number) => {
  try {
    const response = await mauticApi.post(`/api/campaigns/${campaignId}/contact/${contactId}/trigger`);
    return response.data;
  } catch (error) {
    console.error('Error triggering Mautic campaign:', error);
    throw error;
  }
};