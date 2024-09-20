// models/AffiliateLink.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import AffiliateProgram from './AffiliateProgram';
import User from './User';

class AffiliateLink extends Model {
  public id!: number;
  public affiliateProgramId!: number;
  public creatorId!: number;
  public originalLink!: string;
  public customAlias!: string;
  public trackingCode!: string;
  public generatedLink!: string;
  public clicks!: number;
  public conversions!: number;
  // Other attributes
}

AffiliateLink.init(
  {
    affiliateProgramId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AffiliateProgram,
        key: 'id',
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    originalLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customAlias: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    trackingCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    generatedLink: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    conversions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Additional fields
  },
  {
    sequelize,
    modelName: 'AffiliateLink',
    tableName: 'affiliate_links',
  }
);

AffiliateLink.belongsTo(AffiliateProgram, { foreignKey: 'affiliateProgramId' });
AffiliateLink.belongsTo(User, { foreignKey: 'creatorId' });

export default AffiliateLink;
