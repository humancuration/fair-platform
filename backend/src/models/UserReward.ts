import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Reward } from '../modules/campaign/Reward';

@Table({
  tableName: 'user_rewards',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['rewardId'],
    },
  ],
})
export class UserReward extends Model<UserReward> {
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

  @ForeignKey(() => Reward)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rewardId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  pointsSpent!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  redeemedAt!: Date;

  @Column({
    type: DataType.ENUM('pending', 'fulfilled', 'expired'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'fulfilled' | 'expired';

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Reward)
  reward!: Reward;
}

export default UserReward;
