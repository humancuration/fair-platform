import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'user_settings',
  timestamps: true,
})
export class UserSettings extends Model<UserSettings> {
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
    unique: true,
  })
  userId!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  notificationsEnabled!: boolean;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  notificationPreferences!: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
    digest?: 'none' | 'daily' | 'weekly';
  };

  @Column({
    type: DataType.STRING,
    defaultValue: 'en',
  })
  language!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timezone!: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  privacy!: {
    profileVisibility?: 'public' | 'private' | 'friends';
    activityVisibility?: 'public' | 'private' | 'friends';
    searchable?: boolean;
  };

  @BelongsTo(() => User)
  user!: User;
}
