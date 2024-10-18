import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class Avatar extends Model {
  public id!: string;
  public userId!: string;
  public baseImage!: string;
  public accessories!: string[];
  public colors!: Record<string, string>;
  public outfit!: string;
  public mood!: string;
  public lastInteraction!: Date;
  public xp!: number;
  public level!: number;
}

Avatar.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    baseImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    colors: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    outfit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mood: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'happy',
    },
    lastInteraction: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Avatar',
  }
);
