// models/Payout.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import AffiliateLink from './AffiliateLink';
import User from './User';

enum PayoutStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

class Payout extends Model {
  public id!: number;
  public affiliateLinkId!: number;
  public amount!: number;
  public status!: PayoutStatus;
  public transactionId!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Payout.init(
  {
    affiliateLinkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AffiliateLink,
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PayoutStatus)),
      allowNull: false,
      defaultValue: PayoutStatus.PENDING,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Payout',
    tableName: 'payouts',
  }
);

Payout.belongsTo(AffiliateLink, { foreignKey: 'affiliateLinkId' });
Payout.belongsTo(User, { foreignKey: 'creatorId' }); // Assuming creatorId is available

export default Payout;
