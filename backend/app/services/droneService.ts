import axios from 'axios';
import logger from '../utils/logger';

const DRONE_URL = process.env.DRONE_URL;
const DRONE_TOKEN = process.env.DRONE_TOKEN;

const droneApi = axios.create({
  baseURL: DRONE_URL,
  headers: {
    'Authorization': `Bearer ${DRONE_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const triggerDroneBuild = async (repo: string, branch: string) => {
  try {
    const response = await droneApi.post(`/repos/${repo}/builds`, { branch });
    logger.info(`Triggered Drone build for ${repo}:${branch}`);
    return response.data;
  } catch (error) {
    logger.error(`Error triggering Drone build: ${error}`);
    throw new Error(`Failed to trigger Drone build: ${error.message}`);
  }
};

export const getDroneBuildStatus = async (repo: string, build: number) => {
  try {
    const response = await droneApi.get(`/repos/${repo}/builds/${build}`);
    logger.info(`Retrieved Drone build status for ${repo}:${build}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching Drone build status: ${error}`);
    throw new Error(`Failed to fetch Drone build status: ${error.message}`);
  }
};
