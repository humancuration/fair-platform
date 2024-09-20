// backend/src/models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

enum UserRole {
  CREATOR = 'creator',
  BRAND = 'brand',
  ADMIN = 'admin',
}

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'creator' | 'business';
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.CREATOR,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
