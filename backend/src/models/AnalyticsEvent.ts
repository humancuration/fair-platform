import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class AnalyticsEvent extends Model {
  public id!: number;
  public userId!: number | string | null;
  public eventType!: string;
  public eventData!: any;
  public timestamp!: Date;
}

AnalyticsEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING, // Changed to STRING to accommodate anonymized IDs
      allowNull: true,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'analytics_events',
    timestamps: false,
  }
);

export default AnalyticsEvent;