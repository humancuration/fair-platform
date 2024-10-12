import { Client, Intents, TextChannel } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log(`Discord Bot Logged in as ${client.user?.tag}`);
});

// Listen for messages
client.on('messageCreate', async (message) => {
  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }

  // Implement more commands as needed
});

// Function to send messages to a specific channel
const sendMessageToChannel = async (channelId: string, content: string): Promise<void> => {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isText()) {
      (channel as TextChannel).send(content);
    }
  } catch (error) {
    console.error('Error sending message to Discord channel:', error);
  }
};

client.login(process.env.DISCORD_BOT_TOKEN);

export { sendMessageToChannel };
