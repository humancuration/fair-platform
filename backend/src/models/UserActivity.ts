import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'user_activities',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['createdAt'],
    },
  ],
})
export class UserActivity extends Model<UserActivity> {
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

  @Column({
    type: DataType.ENUM(
      'login',
      'group_join',
      'event_attendance',
      'contribution',
      'achievement',
      'vote',
      'comment',
      'resource_share'
    ),
    allowNull: false,
  })
  type!: 'login' | 'group_join' | 'event_attendance' | 'contribution' | 'achievement' | 'vote' | 'comment' | 'resource_share';

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  points?: number;

  @BelongsTo(() => User)
  user!: User;
}

export default UserActivity;
