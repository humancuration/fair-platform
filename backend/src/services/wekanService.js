const axios = require('axios');

const createWekanCard = async (boardId, listId, cardTitle, cardDescription) => {
  try {
    const response = await axios.post(
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

module.exports = { createWekanCard };