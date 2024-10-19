import axios from 'axios';
import { RateLimiter } from 'limiter';
import logger from '../utils/logger';

const DISCOURSE_URL = process.env.DISCOURSE_URL;
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY;
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME;

const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });

const discourseApi = axios.create({
  baseURL: DISCOURSE_URL,
  headers: {
    'Api-Key': DISCOURSE_API_KEY,
    'Api-Username': DISCOURSE_API_USERNAME,
  },
});

const makeRequest = async (method: string, endpoint: string, data?: any) => {
  await limiter.removeTokens(1);
  try {
    const response = await discourseApi.request({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    logger.error(`Discourse API error: ${error}`);
    throw new Error(`Discourse API request failed: ${error.message}`);
  }
};

export const createDiscourseUser = async (user: any) => {
  return makeRequest('POST', '/users', {
    name: user.name,
    email: user.email,
    password: user.password,
    username: user.username,
    active: true,
    approved: true,
  });
};

export const createDiscoursePost = async (topic: string, content: string, category: number, username: string) => {
  return makeRequest('POST', '/posts', {
    title: topic,
    raw: content,
    category: category,
    created_at: new Date().toISOString(),
  });
};

// Add more Discourse API interactions as needed
