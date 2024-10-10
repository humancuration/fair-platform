const { sendMessageToChannel } = require('../discordBot');
const { sendDiscordWebhook } = require('../services/discordService');
const { sendRocketChatMessage } = require('../services/rocketChatService');
const { createWekanCard } = require('../services/wekanService');
const { createNextcloudFolder } = require('../services/nextcloudService');

exports.createGroup = async (req, res) => {
  // ... existing code to create group

  // Notify Discord channel
  const discordChannelId = process.env.DISCORD_CHANNEL_ID; // Set in .env
  const message = `🎉 New Group Created: **${group.name}** by ${user.username}! Join us to collaborate and innovate.`;
  sendMessageToChannel(discordChannelId, message);

  // Send Discord webhook notification
  const webhookURL = process.env.DISCORD_WEBHOOK_URL; // Set in .env
  sendDiscordWebhook(webhookURL, message);

  // Send Rocket.Chat message
  const rocketChatRoomId = process.env.ROCKET_CHAT_ROOM_ID; // Set in .env
  sendRocketChatMessage(rocketChatRoomId, message);

  // Create Wekan card
  const wekanBoardId = process.env.WEKAN_BOARD_ID; // Set in .env
  const wekanListId = process.env.WEKAN_LIST_ID; // Set in .env
  await createWekanCard(wekanBoardId, wekanListId, `New Group: ${group.name}`, `Created by ${user.username}`);

  // Create Nextcloud folder
  await createNextcloudFolder(`Groups/${group.name}`);

  res.status(201).json(group);
};