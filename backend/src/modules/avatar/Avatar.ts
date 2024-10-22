import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from '../../config/database';
import { User } from '../user/User';

export class Avatar extends Model {
  public id!: string;
  public userId!: string;
  public baseImage!: string;
  public accessories!: string[];
  public colors!: Record<string, string>;
  public outfit!: string;
  public mood!: string;
  public emotion!: string;
  public emotionIntensity!: number;
  public lastInteraction!: Date;
  public xp!: number;
  public level!: number;
  public background!: string;
  // New fields
  public energy!: number;
  public happiness!: number;
  public customizations!: Record<string, any>;
  public achievements!: string[];
  public stats!: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
  };
  public lastDailyReward!: Date;
  public streakCount!: number;

  // Associations
  public static associations: {
    user: Association<Avatar, User>;
  };
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
    emotion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'neutral',
    },
    emotionIntensity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: 1,
        max: 10,
      },
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
    background: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    energy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 0,
        max: 100,
      },
    },
    happiness: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 0,
        max: 100,
      },
    },
    customizations: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    achievements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    stats: {
      type: DataTypes.JSON,
      defaultValue: {
        strength: 1,
        agility: 1,
        intelligence: 1,
        charisma: 1,
      },
    },
    lastDailyReward: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    streakCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Avatar',
    tableName: 'avatars',
    timestamps: true,
  }
);

// Define associations
Avatar.belongsTo(User, { foreignKey: 'userId', as: 'user' });
