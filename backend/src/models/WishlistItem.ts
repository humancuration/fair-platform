import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';

class WishlistItem extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  public image!: string;
  public isPublic!: boolean;
  public createdAt!: Date;

  // Associations
  public readonly user?: User;
}

WishlistItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wishlist_items',
    timestamps: false,
  }
);

WishlistItem.belongsTo(User, { foreignKey: 'userId' });

export default WishlistItem;