import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { User } from '../auth/User';

@Table({
  tableName: 'product_bundles',
  timestamps: true,
})
export class Bundle extends Model {
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
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalPrice!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  discountedPrice!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validFrom!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validUntil!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  limitedQuantity?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  soldCount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl?: string;

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

  @HasMany(() => BundleProduct)
  products!: BundleProduct[];
}

@Table({
  tableName: 'bundle_products',
  timestamps: true,
})
export class BundleProduct extends Model {
  @ForeignKey(() => Bundle)
  @Column
  bundleId!: string;

  @ForeignKey(() => Product)
  @Column
  productId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discountPercentage!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @BelongsTo(() => Bundle)
  bundle!: Bundle;
}
