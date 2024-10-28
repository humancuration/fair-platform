import { Request, Response } from 'express';
import axios from 'axios';

interface AuthRequest extends Request {
  user: {
    githubAccessToken: string;
  };
}

// Fetch user repositories
export const getUserRepos = async (req: AuthRequest, res: Response) => {
  const accessToken = req.user.githubAccessToken;
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${accessToken}` },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
  }
};
