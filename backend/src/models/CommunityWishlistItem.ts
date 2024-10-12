import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';

class CommunityWishlistItem extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description?: string;
  public image?: string;
  public price!: number;
  public contributors!: number[];
  public totalContributions!: number;

}

CommunityWishlistItem.init(
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
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    contributors: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    totalContributions: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'community_wishlist_items',
  }
);

// Correct association definition
CommunityWishlistItem.belongsTo(User, { foreignKey: 'userId' });

export default CommunityWishlistItem;

