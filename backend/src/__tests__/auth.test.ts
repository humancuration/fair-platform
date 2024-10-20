import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth';
import { connectToDatabase } from '../config/database';
import User from '../modules/user/User';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  // Close the database connection
  await (User as any).sequelize.close();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123',
        role: 'creator'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(400);
  });
});