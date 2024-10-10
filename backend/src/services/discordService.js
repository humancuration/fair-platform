const axios = require('axios');

const sendDiscordWebhook = async (webhookURL, content) => {
  try {
    await axios.post(webhookURL, {
      content,
    });
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
  }
};

module.exports = { sendDiscordWebhook };