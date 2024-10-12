import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;

router.get('/discord', (req: Request, res: Response) => {
  const redirect_uri = `${process.env.BASE_URL}/api/auth/discord/callback`;
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&response_type=code&scope=identify%20guilds`
  );
});

router.get('/discord/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      `https://discord.com/api/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: `${process.env.BASE_URL}/api/auth/discord/callback`,
        scope: 'identify guilds',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Discord OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

export default router;
