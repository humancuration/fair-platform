import axios from 'axios';

const GITEA_URL = process.env.GITEA_URL;
const GITEA_TOKEN = process.env.GITEA_TOKEN;

const giteaApi = axios.create({
  baseURL: GITEA_URL,
  headers: {
    'Authorization': `token ${GITEA_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const createGiteaRepository = async (repoData: any) => {
  try {
    const response = await giteaApi.post('/user/repos', repoData);
    return response.data;
  } catch (error) {
    console.error('Error creating Gitea repository:', error);
    throw error;
  }
};

export const getGiteaIssues = async (owner: string, repo: string) => {
  try {
    const response = await giteaApi.get(`/repos/${owner}/${repo}/issues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Gitea issues:', error);
    throw error;
  }
};