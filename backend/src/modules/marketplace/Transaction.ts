import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../auth/User';
import { Product } from './Product';

@Table({
  tableName: 'marketplace_transactions',
  timestamps: true,
})
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column
  buyerId!: string;

  @ForeignKey(() => User)
  @Column
  sellerId!: string;

  @ForeignKey(() => Product)
  @Column
  productId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  commission!: number;

  @ForeignKey(() => User)
  @Column
  affiliateId?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  affiliateCommission?: number;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  })
  status!: string;

  @BelongsTo(() => User, 'buyerId')
  buyer!: User;

  @BelongsTo(() => User, 'sellerId')
  seller!: User;

  @BelongsTo(() => Product)
  product!: Product;

  @BelongsTo(() => User, 'affiliateId')
  affiliate?: User;
}
