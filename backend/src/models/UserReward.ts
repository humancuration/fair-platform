import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'user_rewards',
  timestamps: true,
})
export class UserReward extends Model<UserReward> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalPoints!: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    defaultValue: [],
  })
  rewardsEarned!: number[];

  @BelongsTo(() => User)
  user!: User;
}

export default UserReward;
