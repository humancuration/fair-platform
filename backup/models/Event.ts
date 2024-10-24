import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany, Index } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';
import { EventAttendee } from './EventAttendee';

@Table({
  tableName: 'events',
  timestamps: true,
  indexes: [
    {
      fields: ['date'],
    },
    {
      fields: ['groupId'],
    },
  ],
})
export class Event extends Model<Event> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    index: true, // Use this instead of @Index
  })
  startDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  virtualMeetingUrl?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxAttendees?: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdById!: number;

  @Column({
    type: DataType.ENUM('draft', 'published', 'cancelled'),
    defaultValue: 'draft',
  })
  status!: 'draft' | 'published' | 'cancelled';

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User, 'createdById')
  createdBy!: User;

  @BelongsToMany(() => User, () => EventAttendee)
  attendees!: User[];
}

export default Event;
