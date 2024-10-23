import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Event } from './Event';

@Table({
  tableName: 'recurring_events',
  timestamps: true,
})
export class RecurringEvent extends Model<RecurringEvent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  parentEventId!: number;

  @Column({
    type: DataType.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
  })
  frequency!: 'daily' | 'weekly' | 'monthly';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  interval!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  customPattern?: {
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    monthsOfYear?: number[];
  };

  @BelongsTo(() => Event)
  parentEvent!: Event;
}
