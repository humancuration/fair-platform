// models/AffiliateProgram.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Brand from './Brand';

class AffiliateProgram extends Model {
  public id!: number;
  public brandId!: number;
  public name!: string;
  public description!: string;
  public commissionRate!: number; // Percentage (e.g., 5 for 5%)
  // Other attributes
}

AffiliateProgram.init(
  {
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    commissionRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 5.0, // Default 5%
    },
    // Additional fields
  },
  {
    sequelize,
    modelName: 'AffiliateProgram',
    tableName: 'affiliate_programs',
  }
);

AffiliateProgram.belongsTo(Brand, { foreignKey: 'brandId' });

export default AffiliateProgram;
