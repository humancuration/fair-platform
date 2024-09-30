import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class CommunityWishlist extends Model {
  public id!: number;
  public communityName!: string;
  // ... other fields
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
    // ... other fields
  },
  {
    sequelize,
    tableName: 'community_wishlists',
  }
);

export default CommunityWishlist;