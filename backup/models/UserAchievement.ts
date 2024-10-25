import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Achievement } from './Achievement1';

@Table({
  tableName: 'user_achievements',
  timestamps: true,
})
export class UserAchievement extends Model<UserAchievement> {
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

  @ForeignKey(() => Achievement)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  achievementId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  earnedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Achievement)
  achievement!: Achievement;
}
