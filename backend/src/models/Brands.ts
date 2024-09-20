// models/Brand.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './User';

class Brand extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  // Other attributes
}

Brand.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
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
    // Additional fields
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
  }
);

Brand.belongsTo(User, { foreignKey: 'userId' });

export default Brand;
