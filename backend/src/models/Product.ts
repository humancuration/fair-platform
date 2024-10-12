import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class Product extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public imageUrl!: string;
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
  }
);

export default Product;
