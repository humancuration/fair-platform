import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Wishlist extends Model {
  public id!: number;
  public name!: string;
  // ... other fields
}

Wishlist.init(
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
    // ... other fields
  },
  {
    sequelize,
    tableName: 'wishlists',
  }
);

export default Wishlist;