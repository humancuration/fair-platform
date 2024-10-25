import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { User } from '../auth/User';

@Table({
  tableName: 'flash_sales',
  timestamps: true,
})
export class FlashSale extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime!: Date;

  @Column({
    type: DataType.ENUM('upcoming', 'active', 'ended'),
    defaultValue: 'upcoming',
  })
  status!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  featured!: boolean;

  @ForeignKey(() => User)
  @Column
  createdById!: string;

  @BelongsTo(() => User)
  createdBy!: User;

  @HasMany(() => FlashSaleProduct)
  products!: FlashSaleProduct[];
}

@Table({
  tableName: 'flash_sale_products',
  timestamps: true,
})
export class FlashSaleProduct extends Model {
  @ForeignKey(() => FlashSale)
  @Column
  flashSaleId!: string;

  @ForeignKey(() => Product)
  @Column
  productId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  salePrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  soldCount!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @BelongsTo(() => FlashSale)
  flashSale!: FlashSale;
}
