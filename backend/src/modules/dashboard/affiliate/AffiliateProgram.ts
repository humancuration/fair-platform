// models/AffiliateProgram.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Brand } from './Brands';
import { AffiliateLink } from './AffiliateLink';

@Table({
  tableName: 'affiliate_programs',
  timestamps: true,
})
export class AffiliateProgram extends Model<AffiliateProgram> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  brandId!: number;

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
    allowNull: false,
    defaultValue: 5.0,
  })
  commissionRate!: number;

  @BelongsTo(() => Brand)
  brand!: Brand;

  @HasMany(() => AffiliateLink)
  affiliateLinks!: AffiliateLink[];
}

export default AffiliateProgram;
