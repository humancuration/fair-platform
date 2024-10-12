import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';

class Notification extends Model {
  public id!: number;
  public userId!: number;
  public message!: string;
  public read!: boolean;
  public date!: Date;

  // Associations
  public readonly user?: User;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
  }
);

Notification.belongsTo(User, { foreignKey: 'userId' });

export default Notification;
