import axios from 'axios';
import logger from '../utils/logger';

interface WekanCard {
  _id: string;
  title: string;
  description: string;
  // Add other properties as needed
}

interface CreateCardParams {
  boardId: string;
  listId: string;
  cardTitle: string;
  cardDescription: string;
}

const wekanApi = axios.create({
  baseURL: process.env.WEKAN_URL,
  headers: {
    'Authorization': `Bearer ${process.env.WEKAN_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const createWekanCard = async (params: CreateCardParams): Promise<WekanCard> => {
  try {
    const response = await wekanApi.post<WekanCard>(
      `/api/boards/${params.boardId}/lists/${params.listId}/cards`,
      {
        title: params.cardTitle,
        description: params.cardDescription,
      }
    );
    logger.info(`Created Wekan card: ${response.data._id}`);
    return response.data;
  } catch (error) {
    logger.error('Error creating Wekan card:', error);
    throw new Error(`Failed to create Wekan card: ${error.message}`);
  }
};

export const getWekanCard = async (boardId: string, cardId: string): Promise<WekanCard> => {
  try {
    const response = await wekanApi.get<WekanCard>(`/api/boards/${boardId}/cards/${cardId}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching Wekan card ${cardId}:`, error);
    throw new Error(`Failed to fetch Wekan card: ${error.message}`);
  }
};

export const updateWekanCard = async (boardId: string, cardId: string, updateData: Partial<WekanCard>): Promise<WekanCard> => {
  try {
    const response = await wekanApi.put<WekanCard>(`/api/boards/${boardId}/cards/${cardId}`, updateData);
    logger.info(`Updated Wekan card: ${cardId}`);
    return response.data;
  } catch (error) {
    logger.error(`Error updating Wekan card ${cardId}:`, error);
    throw new Error(`Failed to update Wekan card: ${error.message}`);
  }
};
