// models/ClickTracking.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AffiliateLink } from './AffiliateLink';

@Table({
  tableName: 'click_trackings',
  timestamps: true,
})
export class ClickTracking extends Model<ClickTracking> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => AffiliateLink)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  affiliateLinkId!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  clickedAt!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userAgent?: string;

  @BelongsTo(() => AffiliateLink)
  affiliateLink!: AffiliateLink;
}

export default ClickTracking;
