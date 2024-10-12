import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public settings!: {
    allowSearchAnalytics: boolean;
    allowBehavioralTracking: boolean;
    dataRetentionPeriod: number;
    anonymizeData: boolean;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        allowSearchAnalytics: false,
        allowBehavioralTracking: false,
        dataRetentionPeriod: 365,
        anonymizeData: false,
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;
