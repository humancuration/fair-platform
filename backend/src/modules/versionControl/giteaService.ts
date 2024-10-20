import axios from 'axios';
import logger from '../../utils/logger';

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
    logger.info(`Created Gitea repository: ${repoData.name}`);
    return response.data;
  } catch (error) {
    logger.error(`Error creating Gitea repository: ${error}`);
    throw new Error(`Failed to create Gitea repository: ${error.message}`);
  }
};

export const getGiteaIssues = async (owner: string, repo: string, page = 1, limit = 30) => {
  try {
    const response = await giteaApi.get(`/repos/${owner}/${repo}/issues`, {
      params: { page, limit },
    });
    logger.info(`Retrieved Gitea issues for ${owner}/${repo} (page ${page})`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching Gitea issues: ${error}`);
    throw new Error(`Failed to fetch Gitea issues: ${error.message}`);
  }
};

export const getAllGiteaIssues = async (owner: string, repo: string) => {
  let allIssues = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const issues = await getGiteaIssues(owner, repo, page, limit);
    allIssues = allIssues.concat(issues);

    if (issues.length < limit) {
      break;
    }
    page++;
  }

  return allIssues;
};
