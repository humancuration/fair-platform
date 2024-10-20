import request from 'supertest';
import app from '../app'; // Ensure your Express app is exported from app.ts
import { sequelize } from '../models';
import User from '../modulesb/user/User';
import jwt from 'jsonwebtoken';
import Minsite from '../models/Minsite';

let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a test user
  const user = await User.create({
    email: 'testuser@example.com',
    password: 'password123',
    role: 'creator',
  });

  // Generate JWT token
  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/minsite/save', () => {
  test('should save a new minisite', async () => {
    const response = await request(app)
      .post('/api/minsite/save')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Minsite',
        content: '<p>Welcome to my minisite!</p>',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Minsite created successfully.');
    expect(response.body.minsite).toHaveProperty('title', 'My First Minsite');
  });

  test('should return 400 if title is missing', async () => {
    const response = await request(app)
      .post('/api/minsite/save')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '<p>Missing title</p>',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Title and content are required.');
  });

  test('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/minsite/save')
      .send({
        title: 'Unauthorized Minsite',
        content: '<p>Should not be saved</p>',
      });

    expect(response.status).toBe(401);
  });
});
