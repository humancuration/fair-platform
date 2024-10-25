import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Wishlist } from './Wishlist';

@Table({
  tableName: 'wishlist_items',
  timestamps: true,
})
export class WishlistItem extends Model<WishlistItem> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Wishlist)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  wishlistId!: number;

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
    type: DataType.FLOAT,
    allowNull: true,
  })
  price?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url?: string;

  @BelongsTo(() => Wishlist)
  wishlist!: Wishlist;
}

export default WishlistItem;
