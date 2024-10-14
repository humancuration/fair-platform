import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('Discord bot is ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Add your bot logic here
});

export function startDiscordBot() {
  client.login(process.env.DISCORD_TOKEN);
}
