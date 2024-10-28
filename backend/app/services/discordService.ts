import axios from 'axios';
import logger from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendDiscordWebhook = async (webhookURL: string, content: string): Promise<void> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await axios.post(webhookURL, { content });
      logger.info(`Discord webhook sent successfully: ${content.substring(0, 50)}...`);
      return;
    } catch (error) {
      logger.warn(`Attempt ${attempt} failed to send Discord webhook: ${error}`);
      if (attempt === MAX_RETRIES) {
        logger.error(`Failed to send Discord webhook after ${MAX_RETRIES} attempts`);
        throw new Error('Failed to send Discord webhook');
      }
      await sleep(RETRY_DELAY * attempt);
    }
  }
};
