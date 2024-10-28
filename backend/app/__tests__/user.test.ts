// tests/user.test.ts
import request from 'supertest';
import app from '../app';
import { sequelize } from '../../../backup/models';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Routes', () => {
  test('Register a new user', async () => {
    const response = await request(app).post('/api/users/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  // Add more tests
});
