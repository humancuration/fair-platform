// utils/generateAffiliateLink.ts

import { v4 as uuidv4 } from 'uuid';

export const generateTrackingCode = (): string => {
  return uuidv4();
};

export const generateAffiliateLink = (baseURL: string, trackingCode: string): string => {
  return `${baseURL}/affiliate/${trackingCode}`;
};
