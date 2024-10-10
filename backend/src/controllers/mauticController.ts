import { Request, Response } from 'express';
import { createMauticContact, addContactToSegment, triggerCampaign } from '../services/mauticService';

export const createContact = async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const mauticContact = await createMauticContact(contactData);
    res.status(201).json(mauticContact);
  } catch (error) {
    console.error('Error creating Mautic contact:', error);
    res.status(500).json({ message: 'Error creating contact' });
  }
};

export const addToSegment = async (req: Request, res: Response) => {
  try {
    const { contactId, segmentId } = req.body;
    const result = await addContactToSegment(contactId, segmentId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding contact to segment:', error);
    res.status(500).json({ message: 'Error adding contact to segment' });
  }
};

export const triggerMauticCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId, contactId } = req.body;
    const result = await triggerCampaign(campaignId, contactId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error triggering Mautic campaign:', error);
    res.status(500).json({ message: 'Error triggering campaign' });
  }
};