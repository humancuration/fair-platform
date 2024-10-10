const axios = require('axios');

// Fetch user repositories
exports.getUserRepos = async (req, res) => {
  const accessToken = req.user.githubAccessToken; // Assume you have stored this
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