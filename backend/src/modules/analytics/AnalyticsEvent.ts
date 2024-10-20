import { Table, Column, Model, DataType, Index, Op } from 'sequelize-typescript';

@Table({
  tableName: 'analytics_events',
  timestamps: true,
})
export class AnalyticsEvent extends Model<AnalyticsEvent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userId!: string;

  @Index
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

  @Index
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  timestamp!: Date;

  static async getEventCountByType(startDate: Date, endDate: Date) {
    return this.findAll({
      attributes: [
        'eventType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ['eventType'],
    });
  }
}
