import axios from 'axios';

interface WekanCard {
  _id: string;
  title: string;
  description: string;
  // Add other properties as needed
}

export const createWekanCard = async (boardId: string, listId: string, cardTitle: string, cardDescription: string): Promise<WekanCard> => {
  try {
    const response = await axios.post<WekanCard>(
      `${process.env.WEKAN_URL}/api/boards/${boardId}/lists/${listId}/cards`,
      {
        title: cardTitle,
        description: cardDescription,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WEKAN_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating Wekan card:', error);
    throw error;
  }
};
