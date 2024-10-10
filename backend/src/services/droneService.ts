import axios from 'axios';

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
    return response.data;
  } catch (error) {
    console.error('Error triggering Drone build:', error);
    throw error;
  }
};

export const getDroneBuildStatus = async (repo: string, build: number) => {
  try {
    const response = await droneApi.get(`/repos/${repo}/builds/${build}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Drone build status:', error);
    throw error;
  }
};