import { Keycloak } from 'keycloak-connect';
import { prisma } from '../lib/prisma';

export class AuthService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      realm: process.env.KEYCLOAK_REALM,
      'auth-server-url': process.env.KEYCLOAK_URL,
      'ssl-required': 'external',
      resource: process.env.KEYCLOAK_CLIENT_ID,
      'confidential-port': 0,
      'bearer-only': true,
    });
  }

  async validateToken(token: string) {
    try {
      const verified = await this.keycloak.grantManager.validateToken(token, 'Bearer');
      if (verified) {
        const user = await prisma.user.upsert({
          where: { keycloakId: verified.content.sub },
          update: {
            email: verified.content.email,
            name: verified.content.preferred_username,
          },
          create: {
            keycloakId: verified.content.sub,
            email: verified.content.email,
            name: verified.content.preferred_username,
            role: 'USER',
          },
        });
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
} 