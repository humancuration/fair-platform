const axios = require('axios');

exports.getGiteaRepos = async (req, res) => {
  const giteaToken = req.user.giteaAccessToken; // Assume you have stored this
  const giteaURL = process.env.GITEA_URL; // e.g., http://localhost:3000/api/v1

  try {
    const response = await axios.get(`${giteaURL}/user/repos`, {
      headers: { Authorization: `token ${giteaToken}` },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Gitea repositories:', error);
    res.status(500).json({ message: 'Failed to fetch Gitea repositories' });
  }
};