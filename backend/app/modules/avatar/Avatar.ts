import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// No need for model definition as it's handled in schema.prisma
export { prisma };
