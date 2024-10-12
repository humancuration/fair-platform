import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class Wishlist extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description?: string;
  public isPublic!: boolean;
  public items!: Array<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
  }>;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    items: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'wishlists',
  }
);

export default Wishlist;