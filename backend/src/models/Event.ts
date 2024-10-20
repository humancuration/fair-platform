import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';
import { Group } from '../modulesb/group/Group';

@Table({
  tableName: 'events',
  timestamps: true,
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
  })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdById!: number;

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User, 'createdById')
  createdBy!: User;

  @BelongsToMany(() => User, 'event_attendees')
  attendees!: User[];
}

export default Event;
