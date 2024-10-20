import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from '../modules/user/User';
import { Item } from './Item';

export class Inventory extends Model {
  public id!: string;
  public userId!: string;
  public itemId!: string;
  public quantity!: number;
}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Item,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Inventory',
  }
);
