import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class CommunityWishlist extends Model {
  public id!: number;
  public communityName!: string;
  public productId!: string;
  public name!: string;
  public image!: string;
  public price!: number;
  public highlighted!: boolean;
  public date!: Date;
}

CommunityWishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    communityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    highlighted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'community_wishlists',
  }
);

export default CommunityWishlist;