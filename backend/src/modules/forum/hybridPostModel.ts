import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../user/User';

@Table({
  tableName: 'hybrid_posts',
  timestamps: true,
})
export class HybridPost extends Model<HybridPost> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.TEXT(5000), // Limit to 5000 characters like Pleroma
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isThread!: boolean;

  @ForeignKey(() => HybridPost)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentId?: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => HybridPost, 'parentId')
  parent?: HybridPost;

  @HasMany(() => HybridPost, 'parentId')
  replies?: HybridPost[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  mentions!: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  hashtags!: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  attachments!: string[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  likesCount!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  repostsCount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  visibility!: 'public' | 'unlisted' | 'private' | 'direct';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  sensitive!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  spoilerText?: string;
}

export default HybridPost;
