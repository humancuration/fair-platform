// backend/src/tests/affiliate.test.ts

import request from 'supertest';
import app from '../app';
import { sequelize } from '../models';
import User from '../models/User';
import AffiliateProgram from '../models/AffiliateProgram';
import AffiliateLink from '../models/AffiliateLink';
import jwt from 'jsonwebtoken';

let token: string;
let affiliateProgramId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a brand user
  const brandUser = await User.create({
    email: 'brand@example.com',
    password: 'password123',
    role: 'brand',
  });

  // Generate JWT token
  token = jwt.sign({ id: brandUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Create an affiliate program
  const affiliateProgram = await AffiliateProgram.create({
    brandId: brandUser.id,
    name: 'Test Affiliate Program',
    description: 'A test affiliate program',
    commissionRate: 10,
  });

  affiliateProgramId = affiliateProgram.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Affiliate Link Management', () => {
  test('Brand can create an affiliate program', async () => {
    const response = await request(app)
      .post('/affiliate/programs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Another Affiliate Program',
        description: 'Another test affiliate program',
        commissionRate: 15,
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Another Affiliate Program');
  });

  test('Creator can create an affiliate link', async () => {
    // Create a creator user
    const creatorUser = await User.create({
      email: 'creator@example.com',
      password: 'password123',
      role: 'creator',
    });

    // Generate JWT token for creator
    const creatorToken = jwt.sign({ id: creatorUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const response = await request(app)
      .post('/affiliate/links')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({
        affiliateProgramId,
        originalLink: 'https://example.com/product',
        customAlias: 'Buy Now',
      });

    expect(response.status).toBe(201);
    expect(response.body.customAlias).toBe('Buy Now');
    expect(response.body.generatedLink).toContain('/affiliate/');
  });

  test('Tracking affiliate link click', async () => {
    // Create a creator and affiliate link
    const creatorUser = await User.create({
      email: 'creator2@example.com',
      password: 'password123',
      role: 'creator',
    });

    const creatorToken = jwt.sign({ id: creatorUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const affiliateLink = await AffiliateLink.create({
      affiliateProgramId,
      creatorId: creatorUser.id,
      originalLink: 'https://example.com/product2',
      customAlias: 'Shop Here',
      trackingCode: 'test-tracking-code',
      generatedLink: 'https://yourplatform.com/affiliate/test-tracking-code',
    });

    const response = await request(app).get(`/affiliate/${affiliateLink.trackingCode}`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://example.com/product2');

    const updatedLink = await AffiliateLink.findByPk(affiliateLink.id);
    expect(updatedLink?.clicks).toBe(1);
  });
});
