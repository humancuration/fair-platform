import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'support_tickets',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['userId'],
    },
  ],
})
export class SupportTicket extends Model<SupportTicket> {
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
  })
  subject!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open',
  })
  status!: 'open' | 'in_progress' | 'resolved' | 'closed';

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  messages!: Array<{
    userId: number;
    message: string;
    timestamp: Date;
    isStaff: boolean;
  }>;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: {
    browser?: string;
    os?: string;
    resolution?: string;
    userAgent?: string;
  };

  @BelongsTo(() => User)
  user!: User;
}
