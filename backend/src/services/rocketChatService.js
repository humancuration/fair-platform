const axios = require('axios');

const sendRocketChatMessage = async (roomId, message) => {
  try {
    await axios.post(
      `${process.env.ROCKET_CHAT_URL}/api/v1/chat.postMessage`,
      {
        roomId,
        text: message,
      },
      {
        headers: {
          'X-Auth-Token': process.env.ROCKET_CHAT_AUTH_TOKEN,
          'X-User-Id': process.env.ROCKET_CHAT_USER_ID,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending Rocket.Chat message:', error);
  }
};

module.exports = { sendRocketChatMessage };