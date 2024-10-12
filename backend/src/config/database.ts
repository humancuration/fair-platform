import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@example.com:5432/dbname', {
  dialect: 'postgres',
  logging: false, // Set to console.log to see the raw SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};
export { sequelize };
