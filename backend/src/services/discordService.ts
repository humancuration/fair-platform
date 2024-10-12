import axios from 'axios';

export const sendDiscordWebhook = async (webhookURL: string, content: string): Promise<void> => {
  try {
    await axios.post(webhookURL, {
      content,
    });
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
  }
};
