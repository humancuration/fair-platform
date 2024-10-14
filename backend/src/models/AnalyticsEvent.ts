import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'analytics_events',
  timestamps: false,
})
export class AnalyticsEvent extends Model<AnalyticsEvent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  eventType!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  eventData!: any;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  timestamp!: Date;
}
