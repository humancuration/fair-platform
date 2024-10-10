import axios from 'axios';

const DISCOURSE_URL = process.env.DISCOURSE_URL;
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY;
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME;

export const createDiscourseUser = async (user: any) => {
  try {
    const response = await axios.post(`${DISCOURSE_URL}/users`, {
      name: user.name,
      email: user.email,
      password: user.password,
      username: user.username,
      active: true,
      approved: true,
    }, {
      headers: {
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': DISCOURSE_API_USERNAME,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Discourse user:', error);
    throw error;
  }
};

export const createDiscoursePost = async (topic: string, content: string, category: number, username: string) => {
  try {
    const response = await axios.post(`${DISCOURSE_URL}/posts`, {
      title: topic,
      raw: content,
      category: category,
      created_at: new Date().toISOString(),
    }, {
      headers: {
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': username,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Discourse post:', error);
    throw error;
  }
};

// Add more Discourse API interactions as needed