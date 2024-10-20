import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';
import { WishlistItem } from './WishlistItem';

@Table({
  tableName: 'wishlists',
  timestamps: true,
})
export class Wishlist extends Model<Wishlist> {
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
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPublic!: boolean;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => WishlistItem)
  items!: WishlistItem[];
}

export default Wishlist;
