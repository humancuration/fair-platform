// backend/src/models/Post.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import User from './User';
import Forum from './Forum';

class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public forumId!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    forumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
  }
);

// Associations
Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(Forum, { foreignKey: 'forumId' });
Forum.hasMany(Post, { foreignKey: 'forumId' });
User.hasMany(Post, { foreignKey: 'userId' });

export default Post;
