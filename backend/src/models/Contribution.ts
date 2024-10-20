import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Campaign } from './Campaign';
import { User } from '../modules/user/User';

@Table({
  tableName: 'contributions',
  timestamps: false,
})
export class Contribution extends Model<Contribution> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Campaign)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  campaignId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  contributorId!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reward?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentIntentId!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @BelongsTo(() => Campaign)
  campaign!: Campaign;

  @BelongsTo(() => User)
  contributor!: User;
}
