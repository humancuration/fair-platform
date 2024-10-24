import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Prisma with error logging
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection has been established successfully.');
    
    // Verify the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection verified');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Cleanup function for graceful shutdown
export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', disconnectFromDatabase);
process.on('SIGINT', disconnectFromDatabase);
