const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// Redirect to Discord for authentication
router.get('/discord', (req, res) => {
  const redirect_uri = `${process.env.BASE_URL}/api/auth/discord/callback`;
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&response_type=code&scope=identify%20guilds`
  );
});

// Discord callback
router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `https://discord.com/api/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
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

    // Fetch user data
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;

    // TODO: Save Discord data to your database and link with user account

    res.redirect('/dashboard'); // Redirect to your frontend dashboard
  } catch (error) {
    console.error('Discord OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;