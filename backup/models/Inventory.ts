import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import { User } from '../user/User';
import { Item } from '../item/Item';

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
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    tableName: 'inventories',
  }
);

Inventory.belongsTo(User, { foreignKey: 'userId' });
Inventory.belongsTo(Item, { foreignKey: 'itemId' });
