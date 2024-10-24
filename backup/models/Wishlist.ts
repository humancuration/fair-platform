import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { WishlistItem } from '../modules/wishlist/WishlistItem';

@Table({
  tableName: 'wishlists',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['visibility'],
    },
  ],
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
    validate: {
      notEmpty: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM('private', 'public', 'shared'),
    defaultValue: 'private',
  })
  visibility!: 'private' | 'public' | 'shared';

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  sharedWith!: string[];

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  settings!: {
    allowComments: boolean;
    notifyOnChanges: boolean;
    sortOrder: 'manual' | 'priority' | 'date' | 'price';
  };

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => WishlistItem)
  items!: WishlistItem[];
}

export default Wishlist;
