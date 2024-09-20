// backend/src/models/Forum.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Forum extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Forum.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'forums',
  }
);

export default Forum;
F