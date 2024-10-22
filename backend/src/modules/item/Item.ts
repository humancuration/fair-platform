import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class Item extends Model {
  public id!: string;
  public name!: string;
  public type!: string;
  public rarity!: string;
  public description!: string;
  public imageUrl!: string;
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    rarity: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'common',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
  }
);
