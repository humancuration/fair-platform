// backend/src/models/Post.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';
import { Forum } from './Forum';

@Table({
  tableName: 'posts',
  timestamps: true,
})
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Forum)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  forumId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Forum)
  forum!: Forum;
}

export default Post;
