import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Item } from './Item';

@Table({
  tableName: 'inventories',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'itemId'],
      unique: true,
    },
  ],
})
export class Inventory extends Model<Inventory> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    index: true, // Use this instead of @Index
  })
  userId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    index: true, // Use this instead of @Index
  })
  itemId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0,
    },
  })
  quantity!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Item)
  item!: Item;
}
