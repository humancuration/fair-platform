const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Redirect user to GitHub for authentication
router.get('/github', (req, res) => {
  const redirect_uri = `${process.env.BASE_URL}/api/auth/github/callback`;
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=repo,user`);
});

// GitHub callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = response.data.access_token;

    // Fetch user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const userData = userResponse.data;

    // TODO: Save userData and accessToken to your database
    // Create session or JWT for authenticated user

    res.redirect('/dashboard'); // Redirect to your frontend dashboard
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;