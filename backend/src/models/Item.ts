import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Item extends Model {
  public id!: string;
  public name!: string;
  public type!: string;
  public rarity!: number;
  public image!: string;
}

Item.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('accessory', 'color', 'base'),
      allowNull: false,
    },
    rarity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Item',
  }
);
