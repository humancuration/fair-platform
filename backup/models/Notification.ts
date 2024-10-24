import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['read'],
    },
  ],
})
export class Notification extends Model<Notification> {
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
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  message!: string;

  @Column({
    type: DataType.ENUM(
      'version-control',
      'event',
      'mention',
      'group',
      'achievement',
      'other'
    ),
    allowNull: false,
  })
  type!: 'version-control' | 'event' | 'mention' | 'group' | 'achievement' | 'other';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  read!: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link?: string;

  @BelongsTo(() => User)
  user!: User;
}

export default Notification;
