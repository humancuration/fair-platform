import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';
import Reward from './Reward';
import Contribution from './Contribution';

class Campaign extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public goalAmount!: number;
  public currentAmount!: number;
  public creatorId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly creator?: User;
  public readonly rewards?: Reward[];
  public readonly contributions?: Contribution[];
}

Campaign.init(
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
    goalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'campaigns',
    timestamps: true,
  }
);

Campaign.belongsTo(User, { foreignKey: 'creatorId' });
Campaign.hasMany(Reward, { foreignKey: 'campaignId', as: 'rewards' });
Campaign.hasMany(Contribution, { foreignKey: 'campaignId', as: 'contributions' });

export default Campaign;