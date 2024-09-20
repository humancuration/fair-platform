// models/ClickTracking.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import AffiliateLink from './AffiliateLink';

class ClickTracking extends Model {
  public id!: number;
  public affiliateLinkId!: number;
  public clickedAt!: Date;
  public ipAddress!: string;
  public userAgent!: string;
  // Other attributes
}

ClickTracking.init(
  {
    affiliateLinkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AffiliateLink,
        key: 'id',
      },
    },
    clickedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Additional fields
  },
  {
    sequelize,
    modelName: 'ClickTracking',
    tableName: 'click_trackings',
  }
);

ClickTracking.belongsTo(AffiliateLink, { foreignKey: 'affiliateLinkId' });

export default ClickTracking;
