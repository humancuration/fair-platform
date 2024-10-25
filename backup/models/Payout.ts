// models/Payout.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AffiliateLink } from './AffiliateLink';
import { User } from '../../user/User';

enum PayoutStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Table({
  tableName: 'payouts',
  timestamps: true,
})
export class Payout extends Model<Payout> {
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
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM(...Object.values(PayoutStatus)),
    allowNull: false,
    defaultValue: PayoutStatus.PENDING,
  })
  status!: PayoutStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionId?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creatorId!: number;

  @BelongsTo(() => AffiliateLink)
  affiliateLink!: AffiliateLink;

  @BelongsTo(() => User)
  creator!: User;
}

export default Payout;
