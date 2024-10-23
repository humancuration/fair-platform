import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Event } from './Event';

@Table({
  tableName: 'event_attendees',
  timestamps: true,
})
export class EventAttendee extends Model<EventAttendee> {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  eventId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'accepted' | 'declined';

  @BelongsTo(() => Event)
  event!: Event;

  @BelongsTo(() => User)
  user!: User;
}
