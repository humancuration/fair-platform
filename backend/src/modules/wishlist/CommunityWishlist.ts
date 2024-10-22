import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/User';

@Table({
  tableName: 'community_wishlists',
  timestamps: true,
})
export class CommunityWishlist extends Model<CommunityWishlist> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  communityName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  highlighted!: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  date!: Date;

  @BelongsTo(() => User)
  user!: User;
}
