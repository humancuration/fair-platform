// backend/src/models/Product.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import User from './User';

class Product extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public sellerId!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);

// Associations
Product.belongsTo(User, { foreignKey: 'sellerId' });
User.hasMany(Product, { foreignKey: 'sellerId' });

export default Product;
