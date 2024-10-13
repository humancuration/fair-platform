import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';
import Repository from './Repository';

class Notification extends Model {
  public id!: number;
  public userId!: number;
  public message!: string;
  public type!: 'version-control' | 'other'; // Added type field
  public read!: boolean;
  public createdAt!: Date; // Renamed 'date' to 'createdAt' for consistency
  public repositoryId?: number; // Added optional repositoryId

  // Associations
  public readonly user?: User;
  public readonly repository?: Repository; // Added repository association
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
    type: {
      type: DataTypes.ENUM('version-control', 'other'),
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    repositoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Repositories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
  }
);

Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(Repository, { foreignKey: 'repositoryId' });

export default Notification;
