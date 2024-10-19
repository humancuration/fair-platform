import axios from 'axios';
import logger from '../utils/logger';

interface RocketChatMessage {
  roomId: string;
  text: string;
}

export const sendRocketChatMessage = async (message: RocketChatMessage): Promise<void> => {
  try {
    await axios.post(
      `${process.env.ROCKET_CHAT_URL}/api/v1/chat.postMessage`,
      message,
      {
        headers: {
          'X-Auth-Token': process.env.ROCKET_CHAT_AUTH_TOKEN!,
          'X-User-Id': process.env.ROCKET_CHAT_USER_ID!,
          'Content-Type': 'application/json',
        },
      }
    );
    logger.info(`Sent Rocket.Chat message to room ${message.roomId}`);
  } catch (error) {
    logger.error('Error sending Rocket.Chat message:', error);
    throw new Error(`Failed to send Rocket.Chat message: ${error.message}`);
  }
};

export const createRocketChatUser = async (userData: any): Promise<any> => {
  try {
    const response = await axios.post(
      `${process.env.ROCKET_CHAT_URL}/api/v1/users.create`,
      userData,
      {
        headers: {
          'X-Auth-Token': process.env.ROCKET_CHAT_AUTH_TOKEN!,
          'X-User-Id': process.env.ROCKET_CHAT_USER_ID!,
          'Content-Type': 'application/json',
        },
      }
    );
    logger.info(`Created Rocket.Chat user: ${userData.username}`);
    return response.data;
  } catch (error) {
    logger.error('Error creating Rocket.Chat user:', error);
    throw new Error(`Failed to create Rocket.Chat user: ${error.message}`);
  }
};
