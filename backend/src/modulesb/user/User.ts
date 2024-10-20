import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Event } from '../../models/Event';
import { Group } from '../group/Group';
import { GroupMember } from './GroupMember';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: {
      allowSearchAnalytics: false,
      allowBehavioralTracking: false,
      dataRetentionPeriod: 365,
      anonymizeData: false,
    },
  })
  settings!: {
    allowSearchAnalytics: boolean;
    allowBehavioralTracking: boolean;
    dataRetentionPeriod: number;
    anonymizeData: boolean;
  };

  @HasMany(() => Event)
  createdEvents!: Event[];

  @BelongsToMany(() => Event, 'event_attendees')
  attendingEvents!: Event[];

  @BelongsToMany(() => Group, () => GroupMember)
  groups!: Group[];
}
