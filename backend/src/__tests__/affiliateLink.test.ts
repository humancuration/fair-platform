// backend/src/tests/affiliateLink.test.ts

import request from 'supertest';
import app from '../app';
import { sequelize } from '../models';
import User from '../modules/user/User';
import Brand from '../models/Brand';
import AffiliateProgram from '../models/AffiliateProgram';

let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a brand user
  const user = await User.create({
    email: 'brand@example.com',
    password: 'password123', // Ensure password is hashed in actual implementation
    role: 'brand',
  });

  // Authenticate and get token (assuming you have a login route)
  const response = await request(app).post('/api/users/login').send({
    email: 'brand@example.com',
    password: 'password123',
  });

  token = response.body.token;

  // Create an affiliate program
  await AffiliateProgram.create({
    brandId: (await Brand.create({ userId: user.id, name: 'Brand A', description: 'Description A' })).id,
    name: 'Summer Sale',
    description: 'Discounts on summer products',
    commissionRate: 10,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Affiliate Links API', () => {
  test('Create Affiliate Link', async () => {
    const affiliateProgram = await AffiliateProgram.findOne();

    const response = await request(app)
      .post('/api/affiliate-links')
      .set('Authorization', `Bearer ${token}`)
      .send({
        affiliateProgramId: affiliateProgram?.id,
        originalLink: 'https://example.com/product',
        customAlias: 'my-product',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('generatedLink');
  });

  test('Get Affiliate Links for Creator', async () => {
    const response = await request(app)
      .get('/api/affiliate-links')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
