import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Campaign from './Campaign';
import User from './User';

class Contribution extends Model {
  public id!: number;
  public campaignId!: number;
  public contributorId!: number;
  public amount!: number;
  public reward?: string;
  public paymentIntentId!: string;
  public createdAt!: Date;

  // Associations
  public readonly campaign?: Campaign;
  public readonly contributor?: User;
}

Contribution.init(
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
    contributorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reward: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'contributions',
    timestamps: false,
  }
);

Contribution.belongsTo(Campaign, { foreignKey: 'campaignId' });
Contribution.belongsTo(User, { foreignKey: 'contributorId' });

export default Contribution;
