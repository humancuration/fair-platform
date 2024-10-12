import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Campaign from './Campaign';

class Reward extends Model {
  public id!: number;
  public campaignId!: number;
  public title!: string;
  public description?: string;
  public amount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly campaign?: Campaign;
}

Reward.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Campaigns',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    tableName: 'rewards',
    timestamps: true,
  }
);

Reward.belongsTo(Campaign, { foreignKey: 'campaignId' });

export default Reward;
