// models/AffiliateLink.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AffiliateProgram } from '../../../../../backup/models/AffiliateProgram';
import { User } from '../modules/user/User';

@Table({
  tableName: 'affiliate_links',
  timestamps: true,
})
export class AffiliateLink extends Model<AffiliateLink> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => AffiliateProgram)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  affiliateProgramId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creatorId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  originalLink!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  customAlias?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  trackingCode!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  generatedLink!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  clicks!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  conversions!: number;

  @BelongsTo(() => AffiliateProgram)
  affiliateProgram!: AffiliateProgram;

  @BelongsTo(() => User)
  creator!: User;
}

export default AffiliateLink;
