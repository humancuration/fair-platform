import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;

router.get('/github', (req: Request, res: Response) => {
  const redirect_uri = `${process.env.BASE_URL}/api/auth/github/callback`;
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=repo,user`);
});

router.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code as string,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = response.data.access_token;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const userData = userResponse.data;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

export default router;
